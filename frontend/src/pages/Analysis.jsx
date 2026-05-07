import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Analysis() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState('chanakya');
  const [conflict, setConflict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConflict = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/conflict/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.success) {
          setConflict(response.data.conflict);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchConflict();
    }
  }, [id, user]);

  if (loading) return <div className="page">Loading analysis...</div>;
  if (error) return <div className="page">Error: {error}</div>;
  if (!conflict) return <div className="page">No analysis found.</div>;

  const analysisData = {
    chanakya: conflict.chanakya,
    therapist: conflict.therapist,
    mediator: conflict.mediator
  };

  const actionPlanItems = Array.isArray(conflict.actionPlan)
    ? conflict.actionPlan
    : typeof conflict.actionPlan === 'string'
      ? conflict.actionPlan
          .split(/\r?\n/)
          .map((line) => line.replace(/^([\d]+[\.)]|[-*])\s*/, '').trim())
          .filter(Boolean)
      : [];

  return (
    <main className="page analysis-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Analysis</span>
          <h1>Conflict Review</h1>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'chanakya' ? 'tab active' : 'tab'} onClick={() => setTab('chanakya')}>
          Chanakya
        </button>
        <button className={tab === 'therapist' ? 'tab active' : 'tab'} onClick={() => setTab('therapist')}>
          Therapist
        </button>
        <button className={tab === 'mediator' ? 'tab active' : 'tab'} onClick={() => setTab('mediator')}>
          Mediator
        </button>
      </div>

      <div className="card analysis-card">
        <p>{analysisData[tab]}</p>
      </div>

      <div className="card action-card">
        <h2>Action Plan</h2>
        <ol>
          {actionPlanItems.length > 0 ? (
            actionPlanItems.map((step, index) => (
              <li key={index}>{step}</li>
            ))
          ) : (
            <>
              <li>Identify the core issue clearly.</li>
              <li>Speak with calm and confidence.</li>
              <li>Validate the other side before sharing your needs.</li>
              <li>Agree on one practical next step together.</li>
              <li>Review the outcome after one week.</li>
            </>
          )}
        </ol>
      </div>

      <Link to="/history" className="button button-secondary">Back to History</Link>
    </main>
  );
}
