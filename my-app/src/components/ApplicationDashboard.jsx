import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Building, Briefcase, CheckCircle, Clock, AlertCircle, Plus, Trash2 } from 'lucide-react';
import './ApplicationDashboard.css';

const ApplicationDashboard = () => {
  const { applications, deleteApplication, fetchApplications } = useAuth();
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    review: 0,
    shortlisted: 0,
    interviews: 0
  });

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const calculateStats = () => {
    const newStats = {
      total: applications.length,
      applied: applications.filter(a => a.status === 'Applied').length,
      review: applications.filter(a => a.status === 'Under Review').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      interviews: applications.filter(a => a.status === 'Interview Scheduled').length
    };
    setStats(newStats);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <Clock size={18} className="status-icon applied" />;
      case 'Under Review':
        return <AlertCircle size={18} className="status-icon review" />;
      case 'Shortlisted':
        return <CheckCircle size={18} className="status-icon shortlisted" />;
      case 'Interview Scheduled':
        return <Briefcase size={18} className="status-icon interview" />;
      default:
        return <Clock size={18} className="status-icon applied" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'applied';
      case 'Under Review':
        return 'review';
      case 'Shortlisted':
        return 'shortlisted';
      case 'Interview Scheduled':
        return 'interview';
      default:
        return 'applied';
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Application Tracker</h2>
        <p className="dashboard-subtitle">Monitor your job applications in real-time</p>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card applied">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <p className="stat-label">Applied</p>
            <p className="stat-value">{stats.applied}</p>
          </div>
        </div>

        <div className="stat-card review">
          <div className="stat-icon">👀</div>
          <div className="stat-content">
            <p className="stat-label">Under Review</p>
            <p className="stat-value">{stats.review}</p>
          </div>
        </div>

        <div className="stat-card shortlisted">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Shortlisted</p>
            <p className="stat-value">{stats.shortlisted}</p>
          </div>
        </div>

        <div className="stat-card interview">
          <div className="stat-icon">🎤</div>
          <div className="stat-content">
            <p className="stat-label">Interviews</p>
            <p className="stat-value">{stats.interviews}</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <h3 className="filter-title">Filter by Status</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Applications
          </button>
          <button
            className={`filter-btn ${filter === 'Applied' ? 'active' : ''}`}
            onClick={() => setFilter('Applied')}
          >
            Applied
          </button>
          <button
            className={`filter-btn ${filter === 'Under Review' ? 'active' : ''}`}
            onClick={() => setFilter('Under Review')}
          >
            Under Review
          </button>
          <button
            className={`filter-btn ${filter === 'Shortlisted' ? 'active' : ''}`}
            onClick={() => setFilter('Shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={`filter-btn ${filter === 'Interview Scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('Interview Scheduled')}
          >
            Interviews
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-section">
        <h3 className="section-title">Your Applications</h3>
        <div className="applications-grid">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div key={app.id} className={`application-card ${getStatusColor(app.status)}`}>
                <div className="card-header">
                  <div className="company-info">
                    <div className="company-logo">🏢</div>
                    <div>
                      <h4 className="company-name">{app.company_name}</h4>
                      <p className="position-title">{app.position_title}</p>
                    </div>
                  </div>
                  <div className="status-badge">
                    {getStatusIcon(app.status)}
                    <span className="status-text">{app.status}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="app-detail">
                    <Calendar size={16} className="detail-icon" />
                    <span>Applied: {formatDate(app.applied_date)}</span>
                  </div>
                  {app.notes && (
                    <div className="app-notes">
                      <p>{app.notes}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="card-action-btn">View Details</button>
                  <button
                    className="card-delete-btn"
                    onClick={() => handleDelete(app.id)}
                    title="Delete application"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-applications">
              <p>No applications found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDashboard;
