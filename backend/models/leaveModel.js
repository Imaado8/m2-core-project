// models/leaveModel.js
import pool from '../config/db.js'; // Updated path to db.js

const leaveModel = {
  /**
   * Fetches all leave requests, optionally filtered by employeeId or name.
   * @param {string} searchTerm - The search term for employeeId or name.
   * @returns {Promise<Array>} - A promise that resolves to an array of leave requests.
   */
  getAll: async (searchTerm = '') => {
    let query = `
      SELECT lr.id, lr.employeeId, ei.name, lr.date, lr.reason, lr.status
      FROM leave_requests lr
      JOIN employees_Information ei ON lr.employeeId = ei.employee_id
    `;
    const queryParams = [];

    if (searchTerm) {
      query += `
        WHERE LOWER(CAST(lr.employeeId AS CHAR)) LIKE ? OR LOWER(ei.name) LIKE ?
      `; // CAST employeeId to CHAR for LIKE comparison
      queryParams.push(`%${searchTerm.toLowerCase()}%`, `%${searchTerm.toLowerCase()}%`);
    }

    query += ` ORDER BY lr.date DESC`;

    const [rows] = await pool.execute(query, queryParams);
    return rows;
  },

  /**
   * Creates a new leave request.
   * @param {object} newRequestData - Object containing employeeId, date, reason.
   * @returns {Promise<object>} - A promise that resolves to the created leave request data.
   */
  create: async (newRequestData) => {
    const { employeeId, date, reason } = newRequestData;
    const insertQuery = "INSERT INTO leave_requests (employeeId, date, reason, status) VALUES (?, ?, ?, 'Pending')";
    const [result] = await pool.execute(insertQuery, [employeeId, date, reason]);

    // Fetch employee name to return complete data
    const [employeeRows] = await pool.execute(
      'SELECT name FROM employees_Information WHERE employee_id = ?',
      [employeeId]
    );
    const employeeName = employeeRows.length > 0 ? employeeRows[0].name : 'Unknown';

    return {
      id: result.insertId,
      employeeId,
      name: employeeName,
      date,
      reason,
      status: 'Pending'
    };
  },

  /**
   * Updates the status of an existing leave request.
   * @param {number} id - The ID of the leave request to update.
   * @param {string} status - The new status ('Approved', 'Denied', 'Pending').
   * @returns {Promise<boolean>} - True if updated, false if not found.
   */
  updateStatus: async (id, status) => {
    const updateQuery = "UPDATE leave_requests SET status = ? WHERE id = ?";
    const [result] = await pool.execute(updateQuery, [status, id]);
    return result.affectedRows > 0;
  },

  /**
   * Checks if an employee exists by their ID.
   * @param {number} employeeId - The ID of the employee.
   * @returns {Promise<boolean>} - True if employee exists, false otherwise.
   */
  employeeExists: async (employeeId) => {
    const [rows] = await pool.execute(
      'SELECT employee_id FROM employees_Information WHERE employee_id = ?',
      [employeeId]
    );
    return rows.length > 0;
  }
};

export default leaveModel;