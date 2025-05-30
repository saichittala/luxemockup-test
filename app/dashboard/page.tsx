"use client";

import { useState, useRef, useEffect } from 'react';
import { useMockups } from '@/context/MockupContext';
import { Mockup } from '@/data/mockups';
import './dashboard.css';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
    const { mockups, addMockup, updateMockup, deleteMockup, loading } = useMockups();
    const [formData, setFormData] = useState<Omit<Mockup, 'slug'>>({
        title: '',
        fileTypes: [],
        image: '',
        tag: 'Free',
        category: '',
        details: '',
        downloadlink: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        router.push('/login');
    };

    const handleInputChange = (field: keyof Mockup, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'fileTypes' ? value.split(',').map(s => s.trim()) : value
        }));
    };

    useEffect(() => {
        if (!loading && editingSlug === null) {
            resetForm();
        }
    }, [mockups, loading]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const generateSlug = (title: string) => title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            alert('Title is required');
            return;
        }

        const slug = generateSlug(formData.title);
        const mockup: Mockup = {
            ...formData,
            slug,
            image: formData.image || imagePreview || '/img/sample.png'
        };

        if (editingSlug) {
            updateMockup(editingSlug, mockup);
        } else {
            if (mockups.some(m => m.slug === slug)) {
                alert('A mockup with this title already exists');
                return;
            }
            addMockup(mockup);
        }

        resetForm();
    };

    const startEditing = (mockup: Mockup) => {
        setFormData({
            title: mockup.title,
            fileTypes: mockup.fileTypes,
            image: mockup.image,
            tag: mockup.tag,
            category: mockup.category,
            details: mockup.details,
            downloadlink: mockup.downloadlink
        });
        setImagePreview(mockup.image);
        setEditingSlug(mockup.slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            fileTypes: [],
            image: '',
            tag: 'Free',
            category: '',
            details: '',
            downloadlink: ''
        });
        setImagePreview('');
        setEditingSlug(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getTagClass = (tag: string) => {
        switch (tag) {
            case 'Free': return 'tag-free';
            case 'Premium': return 'tag-premium';
            case 'New': return 'tag-new';
            default: return '';
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Mockups Dashboard</h1>
                <div>
                    <span className="tag mr-2">Total Mockups: {mockups.length}</span>
                    <button onClick={handleLogout} className="btn btn-logout ml-4">
                        Logout
                    </button>
                </div>
            </div>

            <div className="add-mockup-section">
                <h2 className="section-title">
                    {editingSlug ? 'Edit Mockup' : 'Add New Mockup'}
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
                            value={formData.fileTypes.join(', ')}
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
                            value={formData.image}
                            onChange={(e) => handleInputChange('image', e.target.value)}
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                                    <line x1="16" y1="5" x2="22" y2="5"></line>
                                    <line x1="19" y1="2" x2="19" y2="8"></line>
                                    <circle cx="9" cy="9" r="2"></circle>
                                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </svg>
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
                            {editingSlug ? 'Update' : 'Add'} Mockup
                        </button>
                        {editingSlug && (
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
                    mockups.map((mockup) => (
                        <div key={mockup.slug} className="mockup-card">
                            <div className="mockup-header">
                                <h3 className="mockup-title">{mockup.title}</h3>
                                <div className="mockup-actions">
                                    <button
                                        className="btn"
                                        onClick={() => startEditing(mockup)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this mockup?')) {
                                                deleteMockup(mockup.slug);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="mockup-body">
                                <div className="mockup-image-container">
                                    <img
                                        src={mockup.image}
                                        alt={mockup.title}
                                        className="mockup-image"
                                    />
                                    <span className={`tag ${getTagClass(mockup.tag)} absolute top-2 left-2`}>
                                        {mockup.tag}
                                    </span>
                                </div>

                                <div className="mockup-details">
                                    <div className="mockup-detail-group">
                                        <label>File Types</label>
                                        <input
                                            type="text"
                                            value={mockup.fileTypes.join(', ')}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mockup-detail-group">
                                        <label>Category</label>
                                        <input
                                            type="text"
                                            value={mockup.category}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mockup-detail-group">
                                        <label>Slug</label>
                                        <input
                                            type="text"
                                            value={mockup.slug}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mockup-detail-group">
                                        <label>Download Link</label>
                                        <input
                                            type="text"
                                            value={mockup.downloadlink}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mockup-detail-group col-span-2">
                                        <label>Details</label>
                                        <textarea
                                            value={mockup.details}
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
};