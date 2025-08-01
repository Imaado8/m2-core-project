import express from 'express';
const router = express.Router();
import pool from '../config/db.js';

router.put('/bulk-update', async (req, res) => {
  try {
    const updates = req.body.updates;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Invalid updates format' });
    }
    // if (updates.length === 0) {
      // return res.status(400).json({ success: false, message: 'No updates provided' });
    // }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const { employeeId, date, status } of updates) {
        await connection.query(
          `INSERT INTO attendance (employee_id, attendance_tracking, status)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE status = VALUES(status)`,
          [employeeId, date, status]
        );
      }

      await connection.commit();
      res.json({ success: true });
    } catch (err) {
      await connection.rollback();
      console.error('Bulk update failed:', err);
      res.status(500).json({ success: false, message: 'Bulk update failed' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
  

export default router;
