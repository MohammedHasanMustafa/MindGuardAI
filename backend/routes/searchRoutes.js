import express from 'express';
import Search from '../models/Search.js';

const router = express.Router();

// Save search query
router.post('/save', async (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Invalid search query' });
  }

  try {
    const savedSearch = await Search.create({ query: query.trim() });
    res.status(201).json(savedSearch);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save search' });
  }
});

export default router;
