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
    // Accept both camelCase and snake_case
    const company_name = req.body.company_name || req.body.companyName;
    const position_title = req.body.position_title || req.body.positionTitle;
    const notes = req.body.notes;
    const rating = req.body.rating;
    const status = req.body.status || 'Applied';

    if (!company_name || !position_title) {
      return res.status(400).json({ error: 'Company name and position are required' });
    }

    const appId = generateId();
    const appliedDate = new Date().toISOString();

    db.run(
      `INSERT INTO job_applications 
       (id, user_id, company_name, position_title, notes, rating, created_at, updated_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [appId, req.userId, company_name, position_title, notes || null, rating || 0, appliedDate, appliedDate, status],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create application' });
        }

        res.status(201).json({
          message: 'Application created successfully',
          application: {
            id: appId,
            user_id: req.userId,
            company_name: company_name,
            position_title: position_title,
            notes,
            rating: rating || 0,
            created_at: appliedDate,
            updated_at: appliedDate,
            status: status
          }
        });
      }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update application
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { company_name, position_title, status, notes, rating } = req.body;

    // Allow updating company_name and position_title along with status, notes, rating
    const updates = [];
    const params = [];

    if (company_name !== undefined) {
      updates.push('company_name = ?');
      params.push(company_name);
    }
    if (position_title !== undefined) {
      updates.push('position_title = ?');
      params.push(position_title);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    if (rating !== undefined) {
      updates.push('rating = ?');
      params.push(rating);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);
    params.push(req.userId);

    const query = `UPDATE job_applications SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;

    db.run(query, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update application' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ message: 'Application updated successfully' });
    });
  } catch (error) {
    console.error('Error updating application:', error);
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
