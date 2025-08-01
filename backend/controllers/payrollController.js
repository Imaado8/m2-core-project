// controllers/payrollController.js
import Payroll from '../models/payrollModel.js';

export async function getPayroll(req, res) {
    try {
        const payroll = await Payroll.getPayrollData();

        const enrichedPayroll = payroll.map(emp => {
            const hourlyRate = emp.finalSalary / 160;
            const grossPay = hourlyRate * emp.hoursWorked;
            const deduction = emp.leaveDeductions * 8 * hourlyRate;
            const netPay = grossPay - deduction;

            let status = 'Good';
            if (deduction >= 800 && deduction < 1500) status = 'Review';
            else if (deduction >= 1500) status = 'Warning';

            return {
                employeeId: emp.employeeId,
                name: emp.name,
                hoursWorked: emp.hoursWorked,
                leaveDeductions: emp.leaveDeductions,
                finalSalary: emp.finalSalary,
                hourlyRate: hourlyRate.toFixed(2),
                grossPay: grossPay.toFixed(2),
                deduction: deduction.toFixed(2),
                netPay: netPay.toFixed(2),
                status,
            };
        });

        res.json(enrichedPayroll);
    } catch (err) {
        console.error('Error fetching payroll:', err);
        res.status(500).json({ message: 'Server error fetching payroll' });
    }
}
