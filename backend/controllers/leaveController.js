
import leaveModel from '../models/leaveModel.js';

const leaveController = {

  getLeaveRequests: async (req, res) => {
    try {
      const searchTerm = req.query.search;
      const requests = await leaveModel.getAll(searchTerm);
      res.json(requests);
    } catch (error) {
      console.error("Error in getLeaveRequests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests." });
    }
  },
  // getLeaveRequestById: async (req, res) => {
  //   try { 


  createLeaveRequest: async (req, res) => {
    try {
      const { employeeId, date, reason } = req.body;

     
      if (!employeeId || !date || !reason) {
        return res.status(400).json({ message: "Missing required fields (employeeId, date, reason)." });
      }

      const employeeExists = await leaveModel.employeeExists(employeeId);
      if (!employeeExists) {
        return res.status(404).json({ message: `Employee with ID ${employeeId} not found.` });
      }

      const newRequest = await leaveModel.create({ employeeId, date, reason });
      res.status(201).json({ message: "Leave request submitted successfully.", request: newRequest });
    } catch (error) {
      console.error("Error in createLeaveRequest:", error);
      res.status(500).json({ message: "Failed to submit leave request." });
    }
  },

 
  updateLeaveRequestStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['Approved', 'Denied', 'Pending'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided. Must be Approved, Denied, or Pending." });
      }

      const updated = await leaveModel.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({ message: "Leave request not found." });
      }

      res.json({ message: `Status updated to ${status} for request ${id}.` });
    } catch (error) {
      console.error("Error in updateLeaveRequestStatus:", error);
      res.status(500).json({ message: "Failed to update status." });
    }
  }
};

export default leaveController;