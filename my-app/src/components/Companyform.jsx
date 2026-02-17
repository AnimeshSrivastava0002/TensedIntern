import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Save } from 'lucide-react';
import './Companyform.css';

const CompanyForm = ({ onClose, initialData = null }) => {
  const { addApplication, updateApplication } = useAuth();
  const isEditMode = Boolean(initialData?.id); // Only treat as edit if ID exists
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    status: 'Applied',
    notes: '',
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        position_title: initialData.position_title || '',
        status: initialData.status || 'Applied',
        notes: initialData.notes || '',
        rating: initialData.rating || 0
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate before proceeding
    const company = formData.company_name.trim();
    const position = formData.position_title.trim();
    
    if (!company || !position) {
      setError('Company name and position title are required');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        company_name: company,
        position_title: position,
        status: formData.status,
        notes: formData.notes,
        rating: formData.rating
      };

      if (isEditMode) {
        // Update existing application
        const result = await updateApplication(initialData.id, submitData);
        if (!result.success) {
          setError(result.error);
          setLoading(false);
          return;
        }
      } else {
        // Add new application
        const result = await addApplication(submitData);
        if (!result.success) {
          setError(result.error);
          setLoading(false);
          return;
        }
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save application');
      setLoading(false);
    }
  };

  const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Offer'];

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>{isEditMode ? 'Edit Application' : 'Add New Application'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="company-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position_title">Position Title *</label>
            <input
              type="text"
              id="position_title"
              name="position_title"
              value={formData.position_title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Application Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about this application..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Rating (0-5)</label>
            <div className="rating-selection">
              {[0, 1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`rating-btn ${formData.rating >= r ? 'active' : ''}`}
                  onClick={() => handleRatingChange(r)}
                >
                  {r === 0 ? 'No' : '★'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;