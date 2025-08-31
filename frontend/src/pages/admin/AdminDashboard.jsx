import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f7f7',
    }}>
      <div style={{
        background: '#fff',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 2px 12px #0002',
        minWidth: 340,
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: 32, color: '#1976d2', fontWeight: 700 }}>Admin Dashboard</h2>
        <button
          onClick={() => navigate('/admin/add-event')}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 6,
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 18,
            cursor: 'pointer',
            boxShadow: '0 1px 4px #0001',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.target.style.background = '#1565c0')}
          onMouseOut={e => (e.target.style.background = '#1976d2')}
        >
          Add Event
        </button>
        <button
          onClick={() => navigate('/admin/review-organizations')}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 6,
            background: '#43a047',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 1px 4px #0001',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.target.style.background = '#388e3c')}
          onMouseOut={e => (e.target.style.background = '#43a047')}
        >
          Review Organizations
        </button>
      </div>
    </div>
  );
}
