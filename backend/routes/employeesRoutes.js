import express from 'express';
const router = express.Router();


router.get('/', async (req, res) => { 
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute('SELECT * FROM employees_Information');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees." });
  }
});


router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const { name, position, department, salary, employment_history, email } = req.body;
  await db.execute(
    'INSERT INTO employees_Information (name, position, department, salary, employment_history, email) VALUES (?, ?, ?, ?, ?, ?)',
    [name, position, department, salary, employment_history, email]
  );
  res.json({ message: 'Employee added' });
});


router.delete('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  await db.execute('DELETE FROM employees_Information WHERE employee_id = ?', [id]);
  res.json({ message: 'Employee deleted' });
});


router.patch('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, position, department, salary, employment_history, email } = req.body;


  // if (!name && !position && !department && !salary && !employment_history && !email) {
  //   return res.status(400).json({ message: "No fields provided for update." });
  // }

  
    let queryParts = [];
    let queryValues = [];
    if (name !== undefined) { queryParts.push('name = ?'); queryValues.push(name); }
    if (position !== undefined) { queryParts.push('position = ?'); queryValues.push(position); }
    if (department !== undefined) { queryParts.push('department = ?'); queryValues.push(department); }
    if (salary !== undefined) { queryParts.push('salary = ?'); queryValues.push(salary); }
    if (employment_history !== undefined) { queryParts.push('employment_history = ?'); queryValues.push(employment_history); }
    if (email !== undefined) { queryParts.push('email = ?'); queryValues.push(email); }

    if (queryParts.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }
    
  await db.execute(
    'UPDATE employees_Information SET name=?, position=?, department=?, salary=?, employment_history=?, email=? WHERE employee_id=?',
    [name, position, department, salary, employment_history, email, id]
  );
  res.json({ message: 'Employee updated' });
});

export default router;
