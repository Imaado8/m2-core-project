import express from 'express';
const router = express.Router();
import db from '../config/db.js';

router.post('/seed', async (req, res) => {
  try {
    await db.execute(`
      INSERT INTO performance_reviews (employee_id, name, position, department)
      SELECT employee_id, name, position, department
      FROM employees_Information
      WHERE employee_id NOT IN (
        SELECT employee_id FROM performance_reviews
      )
    `);
    res.json({ success: true, message: 'Seeded successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: 'Seeding failed' });
  }
});

// router.get('/seed-status', async (req, res) => {
//   try {
//     const [rows] = await db.execute('SELECT COUNT(*) AS count FROM performance_reviews');
//     res.json({ seeded: rows[0].count > 0 });
//   } catch (err) {
//     console.error('Fetch seed status error:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch seed status' });
//   }

router.get('/reviews', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM performance_reviews');
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

router.post('/save', async (req, res) => {
  const reviews = req.body;

  try {
    for (const review of reviews) {
      await db.execute(`
        UPDATE performance_reviews SET 
          excellent = ?, 
          satisfactory = ?, 
          unsatisfactory = ?, 
          hr_comment = ?
        WHERE employee_id = ?
      `, [
        review.excellent ? 1 : 0,
        review.satisfactory ? 1 : 0,
        review.unsatisfactory ? 1 : 0,
        review.hr_comment || '',
        review.employee_id
      ]);
    }

    res.json({ success: true, message: 'All reviews updated.' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update reviews' });
  }
});

export default router;
