import express from 'express';
import { getPayroll } from '../controllers/payrollController.js';

const router = express.Router();

router.get('/', getPayroll);

export default router; 
