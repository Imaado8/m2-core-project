
import express from 'express';
import leaveController from '../controllers/leaveController.js';

const router = express.Router();


router.get('/', leaveController.getLeaveRequests);


router.post('/', leaveController.createLeaveRequest);


router.put('/:id/status', leaveController.updateLeaveRequestStatus);

export default router;