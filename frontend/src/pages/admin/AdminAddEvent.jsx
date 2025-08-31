/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAddEvent() {
  const [form, setForm] = useState({
  title: '',
  description: '',
  category: '',
  location: '',
  startDate: '',
  endDate: '',
  severity: '',
  isOngoing: false,
  estimatedAffectedPeople: '',
  coverImage: '',
  urgencyLevel: '',
  fundingGoal: '',
  currentFunding: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        uploadCoverImageToCloudinary(file);
      }
    } else {
      setForm({
        ...form,
        [name]: type === 'checkbox' ? checked : value
      });
    }

    // ...existing code...
  };

  // Cloudinary config (replace with your values)
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqxcgemok/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'AIDlink demo';

  const uploadCoverImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.secure_url) {
        setForm(prev => ({ ...prev, coverImage: result.secure_url }));
      } else {
        setMessage('Failed to upload image');
      }
    } catch {
      setMessage('Failed to upload image');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMessage('Event added successfully!');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        setMessage('Failed to add event');
      }
    } catch {
      setMessage('Network error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: 'linear-gradient(120deg, #e3f2fd 0%, #f7f7f7 100%)' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 40,
        borderRadius: 16,
        boxShadow: '0 4px 24px #0002',
        minWidth: 380,
        maxWidth: 480,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#1976d2', fontWeight: 700, fontSize: 28 }}>Add New Event</h2>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, minHeight: 60 }} />
        <label style={{ fontWeight: 500, marginBottom: 4 }}>Category
          <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, marginTop: 4 }}>
            <option value="">Select Category</option>
            <option value="Disaster">Disaster</option>
            <option value="Health">Health</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        </div>
        <label style={{ fontWeight: 500, marginBottom: 4 }}>Severity
          <select name="severity" value={form.severity} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, marginTop: 4 }}>
            <option value="">Select Severity</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, fontSize: 16 }}>
          <input name="isOngoing" type="checkbox" checked={form.isOngoing} onChange={handleChange} style={{ accentColor: '#1976d2' }} /> Ongoing
        </label>
        <input name="estimatedAffectedPeople" type="number" value={form.estimatedAffectedPeople} onChange={handleChange} placeholder="Estimated Affected People" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <label style={{ fontWeight: 500, marginBottom: 4 }}>Cover Image
          <input
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, marginTop: 4 }}
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover Preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', marginTop: 8, borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
          )}
        </label>
        <label style={{ fontWeight: 500, marginBottom: 4 }}>Urgency Level
          <select name="urgencyLevel" value={form.urgencyLevel} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, marginTop: 4 }}>
            <option value="">Select Urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Immediate">Immediate</option>
          </select>
        </label>
        <input name="fundingGoal" type="number" value={form.fundingGoal} onChange={handleChange} placeholder="Funding Goal" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <input name="currentFunding" type="number" value={form.currentFunding} onChange={handleChange} placeholder="Current Funding" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 6, background: 'linear-gradient(90deg, #1976d2 60%, #43a047 100%)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #0001', cursor: 'pointer', marginTop: 8, transition: 'background 0.2s' }}>Submit</button>
        <div style={{ marginTop: 18, color: message.includes('error') ? 'red' : 'green', textAlign: 'center', fontWeight: 500 }}>{message}</div>
      </form>
    </div>
  );
}