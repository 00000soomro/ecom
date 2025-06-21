import React, { useState } from 'react';
import axios from 'axios';

const TemplateEditor = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [components, setComponents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/templates',
        { name, category, components },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Template created successfully');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Template Editor</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Save Template
        </button>
      </form>
    </div>
  );
};

export default TemplateEditor;