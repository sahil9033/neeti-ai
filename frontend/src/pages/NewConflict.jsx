import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const types = ['Family', 'Workplace', 'Relationship', 'Business', 'Social'];
const tones = ['Diplomatic', 'Balanced', 'Blunt'];

export default function NewConflict() {
  const [conflictType, setConflictType] = useState(types[0]);
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('Balanced');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/conflict/analyze`,
        {
          description,
          conflictType: conflictType.toLowerCase(),
          tone: tone.toLowerCase()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        navigate(`/conflict/${response.data.id}`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page conflict-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Conflict Builder</span>
          <h1>Setup your conflict</h1>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div className="form-section">
          <h2>Choose a conflict category</h2>
          <div className="grid-grid">
            {types.map((type) => (
              <button
                type="button"
                key={type}
                className={`pill ${conflictType === type ? 'active' : ''}`}
                onClick={() => setConflictType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Describe your situation</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            placeholder="Write what happened, who is involved, and what you want to resolve..."
          />
          <div className="char-count">{description.length}/2000</div>
        </div>

        <div className="form-section">
          <h2>Select a tone</h2>
          <div className="tone-grid">
            {tones.map((option) => (
              <label key={option} className={`tone-chip ${tone === option ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="tone"
                  value={option}
                  checked={tone === option}
                  onChange={() => setTone(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Analyzing...' : 'Analyze with NEETI'}
        </button>
      </form>
    </main>
  );
}
