import express from 'express';
import db from '../db.js';
import { generateId } from '../utils.js';
import { authMiddleware } from '../middleware.js';

const router = express.Router();

// Get all applications for user
router.get('/', authMiddleware, (req, res) => {
  try {
    const { status, sort } = req.query;
    let query = 'SELECT * FROM job_applications WHERE user_id = ?';
    let params = [req.userId];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (sort === 'recent') {
      query += ' ORDER BY applied_date DESC';
    } else if (sort === 'oldest') {
      query += ' ORDER BY applied_date ASC';
    }

    db.all(query, params, (err, applications) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(applications);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single application
router.get('/:id', authMiddleware, (req, res) => {
  db.get(
    'SELECT * FROM job_applications WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err, application) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json(application);
    }
  );
});

// Create application
router.post('/', authMiddleware, (req, res) => {
  try {
    const { companyName, positionTitle, jobUrl, notes, rating } = req.body;

    if (!companyName || !positionTitle) {
      return res.status(400).json({ error: 'Company name and position are required' });
    }

    const appId = generateId();
    const appliedDate = new Date().toISOString();

    db.run(
      `INSERT INTO job_applications 
       (id, user_id, company_name, position_title, job_url, notes, rating, applied_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [appId, req.userId, companyName, positionTitle, jobUrl || null, notes || null, rating || 0, appliedDate, 'Applied'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create application' });
        }

        res.status(201).json({
          message: 'Application created successfully',
          application: {
            id: appId,
            user_id: req.userId,
            company_name: companyName,
            position_title: positionTitle,
            job_url: jobUrl,
            notes,
            rating: rating || 0,
            applied_date: appliedDate,
            status: 'Applied'
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { status, notes, rating } = req.body;

    db.run(
      `UPDATE job_applications 
       SET status = ?, notes = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND user_id = ?`,
      [status || null, notes || null, rating || null, req.params.id, req.userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update application' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Application not found' });
        }

        res.json({ message: 'Application updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete application
router.delete('/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM job_applications WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete application' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ message: 'Application deleted successfully' });
    }
  );
});

// Get application statistics
router.get('/stats/summary', authMiddleware, (req, res) => {
  db.all(
    'SELECT status, COUNT(*) as count FROM job_applications WHERE user_id = ? GROUP BY status',
    [req.userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const summary = {
        total: 0,
        applied: 0,
        review: 0,
        shortlisted: 0,
        interviews: 0
      };

      stats.forEach(stat => {
        summary.total += stat.count;
        if (stat.status === 'Applied') summary.applied = stat.count;
        if (stat.status === 'Under Review') summary.review = stat.count;
        if (stat.status === 'Shortlisted') summary.shortlisted = stat.count;
        if (stat.status === 'Interview Scheduled') summary.interviews = stat.count;
      });

      res.json(summary);
    }
  );
});

export default router;
