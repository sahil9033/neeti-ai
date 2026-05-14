import express from 'express';
import rateLimit from 'express-rate-limit';
import { verifyAuth } from '../middleware/auth.js';
import { analyzeConflict, followUpCall } from '../services/openrouter.js';
import { db, admin } from '../services/firebase.js';

const router = express.Router();

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Try again later.' }
});

const VALID_TYPES = ['family', 'workplace', 'relationship', 'business', 'social'];
const VALID_TONES = ['diplomatic', 'balanced', 'blunt'];
const VALID_MODES = ['chanakya', 'therapist', 'mediator'];

// Strip HTML tags from input
const sanitize = (str) => String(str).replace(/<[^>]*>/g, '').trim();

// POST /api/conflict/analyze
router.post('/analyze', verifyAuth, analyzeLimiter, async (req, res) => {
  let { description, conflictType = 'general', tone = 'balanced' } = req.body;

  description = sanitize(description);
  conflictType = String(conflictType).toLowerCase();
  tone = String(tone).toLowerCase();

  if (!description || description.length === 0) {
    return res.status(400).json({ success: false, error: 'Description is required.' });
  }
  if (description.length > 2000) {
    return res.status(400).json({ success: false, error: 'Description must be 2000 characters or fewer.' });
  }
  if (!VALID_TYPES.includes(conflictType)) {
    conflictType = 'general';
  }
  if (!VALID_TONES.includes(tone)) {
    tone = 'balanced';
  }

  try {
    const analysis = await analyzeConflict(description, conflictType, tone);
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await db.collection('conflicts').add({
      userId: req.user.uid,
      description,
      conflictType,
      tone,
      ...analysis,
      followUps: [],
      createdAt
    });

    const savedDoc = await docRef.get();
    const savedData = savedDoc.data();

    res.json({ success: true, id: docRef.id, conflict: { id: docRef.id, ...savedData } });
  } catch (err) {
    console.error('[CONFLICT] analyze error:', err);
    res.status(500).json({ success: false, error: err.message || 'Analysis failed.' });
  }
});

// GET /api/conflict/history
router.get('/history', verifyAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('conflicts')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const conflicts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, conflicts });
  } catch (err) {
    console.error('[CONFLICT] history error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch history.' });
  }
});

// GET /api/conflict/:id
router.get('/:id', verifyAuth, async (req, res) => {
  try {
    const docRef = db.collection('conflicts').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Conflict not found.' });
    }

    const data = doc.data();
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Unauthorized access.' });
    }

    res.json({ success: true, conflict: { id: doc.id, ...data } });
  } catch (err) {
    console.error('[CONFLICT] fetch by id error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch conflict.' });
  }
});

// DELETE /api/conflict/:id
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const docRef = db.collection('conflicts').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Conflict not found.' });
    }

    const data = doc.data();
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Unauthorized access.' });
    }

    await docRef.delete();
    res.json({ success: true, message: 'Conflict deleted.' });
  } catch (err) {
    console.error('[CONFLICT] delete error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to delete conflict.' });
  }
});

// POST /api/conflict/:id/followup
router.post('/:id/followup', verifyAuth, async (req, res) => {
  let { question, mode } = req.body;

  question = sanitize(question || '');
  mode = String(mode || 'mediator').toLowerCase();

  if (!question) {
    return res.status(400).json({ success: false, error: 'Question is required.' });
  }
  if (!VALID_MODES.includes(mode)) {
    mode = 'mediator';
  }

  try {
    const docRef = db.collection('conflicts').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Conflict not found.' });
    }

    const data = doc.data();
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Unauthorized access.' });
    }

    const answer = await followUpCall(mode, data.description, question);

    const followUpEntry = {
      question,
      answer,
      mode,
      createdAt: new Date().toISOString()
    };

    await docRef.update({
      followUps: admin.firestore.FieldValue.arrayUnion(followUpEntry)
    });

    res.json({ success: true, answer, followUp: followUpEntry });
  } catch (err) {
    console.error('[CONFLICT] followup error:', err);
    res.status(500).json({ success: false, error: err.message || 'Follow-up failed.' });
  }
});

export default router;
