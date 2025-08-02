import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createPost } from '../services/postService';

const NewPost = () => {
  const { token } = useContext(AuthContext);

  // Local state for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert('Please fill all required fields.');
      return;
    }

    // FormData to handle file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    try {
      // Send post data to backend
      await createPost(formData, token);
      navigate('/'); 
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Post creation failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-xl">
      {/* Page heading */}
      <h1 className="text-3xl font-semibold text-center text-black mb-6">Create New Post</h1>

      {/* Post creation form */}
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your thought..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default NewPost;
