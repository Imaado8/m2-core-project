// models/payrollModel.js
import pool from '../config/db.js';

async function getPayrollData() {
  const [rows] = await pool.query(`
    SELECT 
      s.employeeId,
      s.name,
      s.hoursWorked,
      s.leaveDeductions,
      s.finalSalary,
      e.salary AS baseSalary
    FROM employee_salaries s
    JOIN employees_Information e ON s.employeeId = e.employee_id
  `);
  return rows;
}

export default {
  getPayrollData,
};
