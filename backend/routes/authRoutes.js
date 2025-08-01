import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  const db = req.app.locals.db;
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM login WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email not found' });
    }

    const user = rows[0];

    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
