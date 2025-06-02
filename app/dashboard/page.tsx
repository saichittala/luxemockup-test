"use client";

import { useState, useRef, useEffect } from 'react';
import './dashboard.css';
import { useRouter } from 'next/navigation';

const STRAPI_URL = "http://localhost:1337";

const getImageUrl = (image: any) => {
  if (image?.data?.attributes?.url) return STRAPI_URL + image.data.attributes.url;
  if (typeof image === "string" && image.startsWith("http")) return image;
  if (typeof image === "string" && image.startsWith("/")) return image;
  return "/img/sample.png";
};

export default function Dashboard() {
  const [mockups, setMockups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    title: '',
    fileTypes: '',
    image: null,
    tag: 'Free',
    category: '',
    details: '',
    downloadlink: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch mockups from Strapi
  const fetchMockups = async () => {
    setLoading(true);
    const res = await fetch(`${STRAPI_URL}/api/mockups?populate=*`);
    const data = await res.json();
    setMockups(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMockups();
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    if (field === 'image') setImagePreview('');
  };

  // Handle image upload to Strapi Media Library
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }
    const uploadData = new FormData();
    uploadData.append("files", file);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) {
      alert("Image upload failed");
      return;
    }

    const data = await res.json();
    setFormData((prev: any) => ({ ...prev, image: data[0] }));
    setImagePreview(STRAPI_URL + data[0].url);
  };

  // Generate slug from title
  const generateSlug = (title: string) => title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Add or update mockup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Title is required');
      return;
    }
    if (formData.downloadlink && !/^https?:\/\/.+/.test(formData.downloadlink)) {
      alert('Please enter a valid download link (must start with http:// or https://)');
      return;
    }

    const slug = generateSlug(formData.title);

    // Prepare data for Strapi
    const payload: any = {
      title: formData.title,
      fileTypes: formData.fileTypes.split(',').map((s: string) => s.trim()),
      tag: formData.tag,
      category: formData.category,
      details: formData.details,
      downloadlink: formData.downloadlink,
      slug,
      image: formData.image?.id ? formData.image.id : null,
    };

    if (editingId) {
      // Update
      await fetch(`${STRAPI_URL}/api/mockups/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
    } else {
      // Create
      await fetch(`${STRAPI_URL}/api/mockups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
    }

    await fetchMockups();
    resetForm();
  };

  // Edit mockup
  const startEditing = (mockup: any) => {
    setFormData({
      title: mockup.attributes.title,
      fileTypes: Array.isArray(mockup.attributes.fileTypes)
        ? mockup.attributes.fileTypes.join(', ')
        : (mockup.attributes.fileTypes || ""),
      image: mockup.attributes.image?.data
        ? { id: mockup.attributes.image.data.id, url: mockup.attributes.image.data.attributes.url }
        : null,
      tag: mockup.attributes.tag || 'Free',
      category: mockup.attributes.category || '',
      details: mockup.attributes.details || '',
      downloadlink: mockup.attributes.downloadlink || ''
    });
    setImagePreview(getImageUrl(mockup.attributes.image));
    setEditingId(mockup.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete mockup
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mockup?')) return;
    await fetch(`${STRAPI_URL}/api/mockups/${id}`, { method: "DELETE" });
    await fetchMockups();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      fileTypes: '',
      image: null,
      tag: 'Free',
      category: '',
      details: '',
      downloadlink: ''
    });
    setImagePreview('');
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Categories
const categories = (() => {
  const map: { [cat: string]: number } = {};
  mockups.forEach(m => {
    if (m && m.attributes && m.attributes.category) {
      const cat = m.attributes.category;
      map[cat] = (map[cat] || 0) + 1;
    }
  });
  return map;
})();

  // Filtered mockups
  const filteredMockups = selectedCategory
    ? mockups.filter(m => m.attributes.category === selectedCategory)
    : mockups;

  return (
    <div className="dashboard-container">
      {loading && <div className="loading-spinner">Loading...</div>}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Mockups Dashboard</h1>
        <div>
          <span className="tag mr-2">Total Mockups: {mockups.length}</span>
          <button onClick={() => {
            localStorage.removeItem('authenticated');
            router.push('/login');
          }} className="btn btn-logout ml-4">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-categories">
        <span className="tag mr-2">Total Mockups: {mockups.length}</span>
        {Object.entries(categories).map(([cat, count]) => (
          <button
            key={cat}
            className={`btn btn-category${selectedCategory === cat ? " active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} ({count})
          </button>
        ))}
        <button
          className={`btn btn-category${selectedCategory === null ? " active" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
      </div>

      <div className="add-mockup-section">
        <h2 className="section-title">
          {editingId ? 'Edit Mockup' : 'Add New Mockup'}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. T-Shirt Mockup"
              required
            />
          </div>

          <div className="form-group">
            <label>File Types</label>
            <input
              type="text"
              className="form-control"
              value={formData.fileTypes}
              onChange={(e) => handleInputChange('fileTypes', e.target.value)}
              placeholder="e.g. PSD, FIG, AI"
            />
          </div>

          <div className="form-group">
            <label>Tag</label>
            <select
              className="form-control"
              value={formData.tag}
              onChange={(e) => handleInputChange('tag', e.target.value)}
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="New">New</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="e.g. Fashion, Print"
            />
          </div>

          <div className="form-group">
            <label>Download Link</label>
            <input
              type="text"
              className="form-control"
              value={formData.downloadlink}
              onChange={(e) => handleInputChange('downloadlink', e.target.value)}
              placeholder="https://example.com/download"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              className="form-control"
              value={formData.image?.url || ""}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, image: { ...prev.image, url: e.target.value } }))}
              placeholder="Or upload image below"
            />
          </div>

          <div className="form-group">
            <label>Details</label>
            <textarea
              className="form-control textarea-control"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Mockup description..."
            />
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
              />
              <div className="file-upload-icon">
                {/* SVG icon here */}
              </div>
              <div className="file-upload-text">
                {imagePreview ? (
                  <span>Image selected</span>
                ) : (
                  <>
                    <span>Click to upload</span> or drag and drop
                    <br />
                    SVG, PNG, JPG (max. 2MB)
                  </>
                )}
              </div>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Image Preview</h4>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Add'} Mockup
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mockup-list">
        <h2 className="section-title">All Mockups</h2>
        {mockups.length === 0 ? (
          <p>No mockups found. Add your first mockup above.</p>
        ) : (
filteredMockups
  .filter(m => m && m.attributes)
  .map((mockup) => (
    <div key={mockup.id} className="mockup-card">
      <div className="mockup-header">
        <h3 className="mockup-title">{mockup.attributes.title}</h3>
                <div className="mockup-actions">
                  <button
                    className="btn"
                    onClick={() => startEditing(mockup)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(mockup.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mockup-body">
                <div className="mockup-image-container">
                  <img
                    src={getImageUrl(mockup.attributes.image)}
                    alt={mockup.attributes.title}
                    className="mockup-image"
                  />
                  <span className={`tag tag-${mockup.attributes.tag?.toLowerCase() || "free"} absolute top-2 left-2`}>
                    {mockup.attributes.tag}
                  </span>
                </div>
                <div className="mockup-details">
                  <div className="mockup-detail-group">
                    <label>File Types</label>
                    <input
                      type="text"
                      value={Array.isArray(mockup.attributes.fileTypes)
                        ? mockup.attributes.fileTypes.join(', ')
                        : (mockup.attributes.fileTypes || "")}
                      readOnly
                    />
                  </div>
                  <div className="mockup-detail-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={mockup.attributes.category}
                      readOnly
                    />
                  </div>
                  <div className="mockup-detail-group">
                    <label>Slug</label>
                    <input
                      type="text"
                      value={mockup.attributes.slug}
                      readOnly
                    />
                  </div>
                  <div className="mockup-detail-group">
                    <label>Download Link</label>
                    <input
                      type="text"
                      value={mockup.attributes.downloadlink}
                      readOnly
                    />
                  </div>
                  <div className="mockup-detail-group col-span-2">
                    <label>Details</label>
                    <textarea
                      value={mockup.attributes.details}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}