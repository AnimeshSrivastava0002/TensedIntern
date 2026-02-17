import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Zap, TrendingUp } from 'lucide-react';
import './LiveJobUpdates.css';

const LiveJobUpdates = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      source: 'LinkedIn',
      posted: '2 hours ago',
      salary: '$150K - $180K',
      hot: true,
      tags: ['React', 'TypeScript', 'Next.js']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      source: 'Indeed',
      posted: '3 hours ago',
      salary: '$140K - $170K',
      hot: false,
      tags: ['Node.js', 'React', 'Azure']
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'Amazon',
      location: 'New York, NY',
      source: 'LinkedIn',
      posted: '1 hour ago',
      salary: '$130K - $160K',
      hot: true,
      tags: ['Python', 'Java', 'AWS']
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'Meta',
      location: 'San Francisco, CA',
      source: 'Glassdoor',
      posted: '4 hours ago',
      salary: '$120K - $150K',
      hot: false,
      tags: ['Kubernetes', 'Docker', 'AWS']
    },
    {
      id: 5,
      title: 'React Native Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      source: 'LinkedIn',
      posted: '30 minutes ago',
      salary: '$140K - $175K',
      hot: true,
      tags: ['React Native', 'iOS', 'Android']
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      // Jobs update in real-time
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredJobs = filter === 'hot' 
    ? jobs.filter(job => job.hot)
    : jobs;

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'salary') {
      return parseInt(b.salary.split('-')[1]) - parseInt(a.salary.split('-')[1]);
    }
    return 0;
  });

  return (
    <div className="live-updates-container">
      {/* Header */}
      <div className="updates-header">
        <div>
          <h2 className="updates-title">
            <Zap className="title-icon" />
            Live Job Updates
          </h2>
          <p className="updates-subtitle">Curated opportunities from trusted sources</p>
        </div>
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>
      </div>

      {/* Sources */}
      <div className="sources-section">
        <h3 className="sources-title">Trusted Sources</h3>
        <div className="sources-grid">
          <div className="source-badge">
            <span className="source-icon">🔗</span>
            LinkedIn
          </div>
          <div className="source-badge">
            <span className="source-icon">🎯</span>
            Indeed
          </div>
          <div className="source-badge">
            <span className="source-icon">⭐</span>
            Glassdoor
          </div>
          <div className="source-badge">
            <span className="source-icon">📊</span>
            GitHub Jobs
          </div>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="controls-section">
        <div className="filter-controls">
          <button
            className={`control-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button
            className={`control-btn ${filter === 'hot' ? 'active' : ''}`}
            onClick={() => setFilter('hot')}
          >
            🔥 Hot Jobs
          </button>
        </div>

        <div className="sort-controls">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-section">
        <div className="jobs-list">
          {sortedJobs.map((job, index) => (
            <div 
              key={job.id} 
              className={`job-card ${job.hot ? 'hot-job' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {job.hot && <div className="hot-badge">🔥 HOT</div>}

              <div className="job-main">
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="source-tag">{job.source}</span>
                </div>

                <div className="job-company">
                  <Briefcase size={16} className="company-icon" />
                  <span>{job.company}</span>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <div className="job-salary">
                  <TrendingUp size={16} />
                  <span>{job.salary}</span>
                </div>

                <div className="job-tags">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="job-actions">
                <button className="apply-btn">Apply Now</button>
                <button className="save-btn">💾</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View More */}
      <div className="view-more-section">
        <button className="view-more-btn">
          View More Opportunities
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default LiveJobUpdates;
