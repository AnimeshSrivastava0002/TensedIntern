import express from 'express';
import db from '../db.js';
import { generateId } from '../utils.js';
import { authMiddleware } from '../middleware.js';

const router = express.Router();

// Get all available jobs
router.get('/', (req, res) => {
  try {
    const { search, source, sort } = req.query;
    let query = 'SELECT * FROM job_listings WHERE 1=1';
    let params = [];

    if (search) {
      query += ' AND (title LIKE ? OR company_name LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }

    if (sort === 'salary') {
      query += ' ORDER BY salary DESC';
    } else if (sort === 'recent') {
      query += ' ORDER BY posted_date DESC';
    } else {
      query += ' ORDER BY is_hot DESC, posted_date DESC';
    }

    db.all(query, params, (err, jobs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(jobs);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hot jobs
router.get('/hot/list', (req, res) => {
  db.all(
    'SELECT * FROM job_listings WHERE is_hot = 1 ORDER BY posted_date DESC',
    (err, jobs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(jobs);
    }
  );
});

// Get saved jobs for user
router.get('/saved/list', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM saved_jobs WHERE user_id = ? ORDER BY saved_at DESC',
    [req.userId],
    (err, jobs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(jobs);
    }
  );
});

// Save a job
router.post('/save', authMiddleware, (req, res) => {
  try {
    const { jobTitle, companyName, location, salary, jobUrl, source, tags } = req.body;

    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required' });
    }

    const jobId = generateId();

    db.run(
      `INSERT INTO saved_jobs 
       (id, user_id, job_title, company_name, location, salary, job_url, source, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [jobId, req.userId, jobTitle, companyName, location || null, salary || null, jobUrl || null, source || null, tags || null],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save job' });
        }

        res.status(201).json({
          message: 'Job saved successfully',
          jobId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove saved job
router.delete('/saved/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM saved_jobs WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove job' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ message: 'Job removed successfully' });
    }
  );
});

// Admin: Add new job listing
router.post('/admin/add', (req, res) => {
  try {
    const { title, companyName, location, salary, jobUrl, source, description, tags, isHot } = req.body;

    if (!title || !companyName) {
      return res.status(400).json({ error: 'Title and company name are required' });
    }

    const jobId = generateId();
    const postedDate = new Date().toISOString();

    db.run(
      `INSERT INTO job_listings 
       (id, title, company_name, location, salary, job_url, source, description, tags, is_hot, posted_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [jobId, title, companyName, location || null, salary || null, jobUrl || null, source || null, description || null, tags || null, isHot ? 1 : 0, postedDate],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to add job' });
        }

        res.status(201).json({
          message: 'Job added successfully',
          jobId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
