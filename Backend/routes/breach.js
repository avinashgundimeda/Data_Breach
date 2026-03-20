const express = require('express');
const router = express.Router();
const Breach = require('../models/Breach');

router.get('/check', async (req, res) => {
  const { phone, first_name, last_name } = req.query;

  if (!phone && !first_name && !last_name) {
    return res.status(400).json({ error: 'Provide at least one field to search' });
  }

  const conditions = [];
  if (phone) conditions.push({ phone: Number(phone.trim()) });
  if (first_name) conditions.push({ first_name: first_name.trim() });
  if (last_name) conditions.push({ last_name: last_name.trim() });

  try {
    const results = await Breach.find({ $or: conditions }).limit(20);
    if (results.length === 0) return res.json({ found: false });
    res.json({ found: true, count: results.length, results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;