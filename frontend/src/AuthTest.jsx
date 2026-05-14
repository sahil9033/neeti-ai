import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import axios from 'axios';
import { auth } from './firebase';

export default function AuthTest() {
  const [user, setUser] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [message, setMessage] = useState('Please summarize this conflict in one paragraph.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setApiResponse(null);
    } catch (err) {
      setError(`Sign-in failed: ${err.message}`);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setApiResponse(null);
      setError(null);
    } catch (err) {
      setError(`Sign-out failed: ${err.message}`);
    }
  };

  // Call Protected API
  const callProtectedAPI = async () => {
    if (!user) {
      setError('Please sign in first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await user.getIdToken();
      const isProd = import.meta.env.MODE === 'production';
      const baseURL = isProd ? '/_/backend' : (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001');
      const response = await axios.post(
        `${baseURL}/api/protected-test`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setApiResponse(response.data);
    } catch (err) {
      setError(`API call failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const callAiTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const isProd = import.meta.env.MODE === 'production';
      const baseURL = isProd ? '/_/backend' : (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001');
      const response = await axios.post(
        `${baseURL}/api/test`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setAiResponse(response.data);
    } catch (err) {
      setError(`AI test failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '680px', margin: '0 auto' }}>
      <h1>⚔️ NEETI — Auth Test</h1>

      {/* Auth Status */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        {user ? (
          <>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Logged in as:</strong> {user.email}
            </p>
            <button
              onClick={handleSignOut}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>Not logged in</p>
            <button
              onClick={handleGoogleSignIn}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>

      {/* Protected API Test */}
      {user && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <h2 style={{ marginTop: '0' }}>Protected API Test</h2>
          <button
            onClick={callProtectedAPI}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Calling API...' : 'Call /api/protected-test'}
          </button>
        </div>
      )}

      {/* AI Test */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2 style={{ marginTop: '0' }}>OpenRouter AI Test</h2>
        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px' }}
        />
        <button
          onClick={callAiTest}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Calling AI...' : 'Call /api/test'}
        </button>
      </div>

      {/* Responses */}
      {apiResponse && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
          <h3 style={{ marginTop: '0', color: '#155724' }}>✅ API Response</h3>
          <pre
            style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '12px',
            }}
          >
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      {aiResponse && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeeba', color: '#856404' }}>
          <h3 style={{ marginTop: '0' }}>🤖 AI Response</h3>
          <pre
            style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '12px',
            }}
          >
            {JSON.stringify(aiResponse, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb', color: '#721c24' }}>
          <h3 style={{ marginTop: '0' }}>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
