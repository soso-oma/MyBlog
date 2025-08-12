import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug, updatePost } from '../services/postService';
import { AuthContext } from '../context/AuthContext';

const EditPost = () => {
  const { slug } = useParams();

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [postId, setPostId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostBySlug(slug);
        const post = res.data;

        setForm({
          title: post.title,
          content: post.content,
          category: post.category || '',
        });

        setPostId(post._id);
      } catch (err) {
        console.error('Failed to load post:', err);
        alert('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Input field changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updatePost(postId, form, token);

      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update post.');
    }
  };

  if (loading) return <p className="text-center">Loading post...</p>;

  // Edit form
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-40"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
