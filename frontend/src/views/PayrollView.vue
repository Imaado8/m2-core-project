<template>
  <div class="payroll-wrapper">
    <div class="table-card">
      <h2 class="attendance-title mb-3 text-center">Payroll System</h2>
      <div class="text-center mb-4 position-relative">
        <input type="search" class="form-control mx-auto search-input" placeholder="Search employees name ..."
          v-model="searchQuery" @focus="showDropdown = true" @input="showDropdown = true"
          @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev"
          @keydown.enter.prevent="selectHighlighted" ref="searchInput" autocomplete="off" />
        <ul v-if="showDropdown && filteredEmployees.length" class="list-group position-absolute w-100 search-dropdown"
          ref="dropdownList">
          <li v-for="(emp, index) in filteredEmployees" :key="emp.employeeId"
            class="list-group-item list-group-item-action" :class="{ active: highlightedIndex === index }"
            @mousedown.prevent="selectEmployeeFromDropdown(emp)" @mouseover="highlightedIndex = index">
            {{ emp.name }} (ID: {{ emp.employeeId }})
          </li>
        </ul>
      </div>
      <!-- Responsive wrapper for table -->
      <div class="overflow-x-auto hidden md:block">
        <table class="styled-table w-full border-separate border-spacing-y-2 text-left text-sm text-gray-700">
          <thead class="bg-gray-100 rounded-lg">
            <tr>
              <th v-for="header in tableHeaders" :key="header" class="p-4 font-semibold first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                {{ header }}
              </th>
              <th class="p-4 font-semibold last:rounded-tr-lg last:rounded-br-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredEmployees.length === 0">
              <td :colspan="tableHeaders.length + 1" class="text-center py-4 bg-white rounded-lg shadow-sm">
                No employee data available.
              </td>
            </tr>
            <tr
              v-else
              v-for="emp in filteredEmployees"
              :key="emp.employeeId"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200"
            >
              <td v-for="field in fieldsToDisplay" :key="field" class="p-4 first:rounded-tl-lg first:rounded-bl-lg">
                {{ emp[field] || "N/A" }}
              </td>
              <td class="p-4 flex gap-2 last:rounded-tr-lg last:rounded-br-lg">
                <button
                  type="button"
                  class="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  @click="viewPayslip(emp)"
                >
                  View
                </button>
                <button
                  class="btn btn-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  @click="downloadPayslip(emp)"
                >
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Payslip Modal -->
       <div class="modal fade" id="payslipModal" ref="payslipModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Payslip - {{ selectedEmployee?.name || "" }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedEmployee">
              <dl class="row">
                <template v-for="(value, key) in selectedEmployee" :key="key">
                  <dt class="col-sm-4">{{ formatKey(key) }}</dt>
                  <dd class="col-sm-8">{{ value || "N/A" }}</dd>
                </template>
              </dl>
            </div>
          </div>
        </div>
      </div>
        <!--Leave deduction-->
      <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="attendance-title mb-3 text-center">Leave Deduction Calculator</h2>
        <label for="employeeSelect" class="form-label">Select Employee:</label>
        <select id="employeeSelect" v-model="selectedCalculatorEmployeeId" class="form-select w-100 mb-3">
          <option disabled value="">-- Select --</option>
          <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
            {{ emp.name }} (ID: {{ emp.employeeId }})
          </option>
        </select>
        <div v-if="calculatedDeduction !== null" class="alert alert-info">
          <p><strong>Leave Days:</strong> {{ selectedCalculatorEmployee.leaveDeductions }}</p>
          <p><strong>Monthly Salary:</strong> R {{ selectedCalculatorEmployee.finalSalary.toLocaleString() }}</p>
          <p><strong>Deduction:</strong> R {{ calculatedDeduction.toFixed(0) }}</p>
          <p><strong>Salary After Deduction:</strong> R {{ salaryAfterDeduction.toFixed(0) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import jsPDF from "jspdf";
export default {
  name: "PayrollSystem",
  // removed the json data below and replaced it with the fetchPayroll method, so it fetches the data from the backend
  data() {
    return {
      employees: [], // Fetched from backend API
      fieldsToDisplay: ["employeeId", "name", "hoursWorked", "leaveDeductions"],
      selectedEmployee: null,
      selectedCalculatorEmployeeId: "",
      bootstrapModalInstance: null,
      searchQuery: "",
      showDropdown: false,
      highlightedIndex: -1,
    };
  },
  mounted() {
    this.fetchPayroll();
  },
  computed: {
    tableHeaders() {
      return this.fieldsToDisplay.map(f => this.formatKey(f));
    },
    filteredEmployees() {
      if (!this.searchQuery.trim()) return this.employees;
      return this.employees.filter(emp =>
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    selectedCalculatorEmployee() {
      return this.employees.find(emp => emp.employeeId === this.selectedCalculatorEmployeeId) || {};
    },
    calculatedDeduction() {
      const emp = this.selectedCalculatorEmployee;
      if (!emp.leaveDeductions || !emp.finalSalary) return null;
      const workingDays = 22;
      return (emp.finalSalary / workingDays) * emp.leaveDeductions;
    },
    salaryAfterDeduction() {
      const emp = this.selectedCalculatorEmployee;
      return emp.finalSalary - this.calculatedDeduction;
    }
  },
  methods: {
    async fetchPayroll() {
      try {
        const response = await fetch("http://localhost:3000/api/payroll");
        const data = await response.json();
        this.employees = data;
      } catch (err) {
        console.error("Error fetching payroll data:", err);
      }
    },
    formatKey(key) {
      return key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
    },
    viewPayslip(emp) {
      this.selectedEmployee = emp;
      if (!this.bootstrapModalInstance) {
        this.bootstrapModalInstance = new bootstrap.Modal(this.$refs.payslipModal);
      }
      this.bootstrapModalInstance.show();
    },
    downloadPayslip(emp) {
      const pdf = new jsPDF();
      const today = new Date();
      const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      const dailyRate = emp.finalSalary / 22;
      const deduction = emp.leaveDeductions * dailyRate;
      const salaryAfter = emp.finalSalary - deduction;
      // Header
      pdf.setFillColor(41, 92, 109); // Modern blue background
      pdf.rect(0, 0, 210, 30, 'F'); // full-width header
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text("ModernTech Solutions", 105, 18, { align: "center" });
      // Subheading
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text("Employee Payslip", 105, 38, { align: "center" });
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${date}`, 15, 48);
      let y = 58;
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.5);
      pdf.line(15, y - 6, 195, y - 6); // line above info
      // Employee Info Section
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      ["employeeId", "name", "hoursWorked", "leaveDeductions"].forEach(field => {
        pdf.text(`${this.formatKey(field)}:`, 20, y);
        pdf.setFont("helvetica", "bold");
        pdf.text(String(emp[field] || "N/A"), 80, y);
        pdf.setFont("helvetica", "normal");
        y += 8;
      });
      y += 6;
      pdf.setLineWidth(0.3);
      pdf.line(15, y, 195, y); // line before salary section
      y += 10;
      // Salary Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Salary Breakdown", 15, y);
      y += 10;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(`Monthly Salary:`, 20, y);
      pdf.text(`R ${emp.finalSalary.toLocaleString()}`, 80, y);
      y += 8;
      pdf.text(`Daily Rate (22 days):`, 20, y);
      pdf.text(`R ${dailyRate.toFixed(2)}`, 80, y);
      y += 8;
      pdf.text(`Leave Deductions:`, 20, y);
      pdf.text(`${emp.leaveDeductions} day(s)`, 80, y);
      y += 8;
      pdf.text(`Deduction:`, 20, y);
      pdf.text(`R ${deduction.toFixed(2)}`, 80, y);
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(34, 108, 63); // green for net salary
      pdf.text(`Net Salary: R ${salaryAfter.toFixed(2)}`, 20, y);
      pdf.setTextColor(0, 0, 0); // reset
      pdf.save(`Payslip_${emp.name}.pdf`);
    },
    selectEmployeeFromDropdown(emp) {
      this.searchQuery = emp.name;
      this.viewPayslip(emp);
      this.showDropdown = false;
    },
    highlightNext() {
      if (this.highlightedIndex < this.filteredEmployees.length - 1) {
        this.highlightedIndex++;
      }
    },
    highlightPrev() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      }
    },
    selectHighlighted() {
      if (this.highlightedIndex >= 0) {
        this.selectEmployeeFromDropdown(this.filteredEmployees[this.highlightedIndex]);
      }
    }
  }
};
</script>
<style scoped>
.payroll-wrapper {
  padding: 2rem 1rem;
  background: #225C70;
  min-height: 100vh;
  max-width: 1250px;
  margin-left: 60px;
  color: #333;
}
@media (max-width: 768px) {
  .payroll-wrapper {
    padding-right: 1rem;
  }
}
.table-card {
  background: #FBF9F5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
.attendance-title {
  font-size: 1.8rem;
  color: #FFFFFF;
  background-color: #295C6D;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.search-dropdown {
  max-width: 600px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  z-index: 1050;
}
.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  font-size: 1rem;
  color: #333;
  background-color: #FBF9F5;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}
.styled-table th,
.styled-table td {
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  text-align: left;
}
.styled-table th {
  background-color: #F3F4F6;
  font-weight: 600;
}
.calculator-card {
  background: #F8F9FA;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.search-input {
  max-width: 600px;
  margin: 0 auto;
  display: block;
}
.modal-dialog {
  max-width: 500px;
  margin: 1.75rem auto;
}
.modal-content {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: none;
  background-color: #FEFEFE;
  max-height: 90vh;
  overflow: hidden;
}
.modal-header {
  background-color: #295C6D;
  color: #FFFFFF;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 0.75rem 1rem;
}
.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.modal-body {
  padding: 1rem 1.25rem;
  background-color: #FFFFFF;
  font-size: 0.95rem;
  max-height: 65vh;
  overflow-y: auto;
}
.modal-body dl {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.modal-body dt {
  font-weight: 600;
  color: #444;
  margin-bottom: 2px;
  font-size: 0.9rem;
}
.modal-body dd {
  margin: 0;
  color: #222;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}
/* Tailwind CSS classes for status badges, defined in JS */
.bg-green-500 { background-color: #22C55E; }
.bg-yellow-500 { background-color: #EAB308; }
.bg-red-500 { background-color: #EF4444; }
.bg-blue-500 { background-color: #9CA3AF}
.rounded-full { border-radius: 9999px; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.font-bold { font-weight: 700; }
/* Modal specific Tailwind classes */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.p-4 { padding: 1rem; }
.z-50 { z-index: 50; }
.rounded-xl { border-radius: 0.75rem; }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.w-full { width: 100%; }
.max-w-md { max-width: 28rem; }
.p-6 { padding: 1.5rem; }
.relative { position: relative; }
.justify-between { justify-content: space-between; }
.mb-4 { margin-bottom: 1rem; }
.text-xl { font-size: 1.25rem; }
.font-semibold { font-weight: 600; }
.text-gray-800 { color: #1F2937; }
.text-gray-400 { color: #9CA3AF; }
.hover\:text-gray-600:hover { color: #4B5563; }
.text-2xl { font-size: 1.5rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.mb-2 { margin-bottom: 0.5rem; }
.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
.appearance-none { appearance: none; }
.border { border-width: 1px; }
.rounded-lg { border-radius: 0.5rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.leading-tight { line-height: 1.25; }
.focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\:shadow-outline:focus { box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); }
.focus\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-shadow, 0 0 #0000); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus\:ring-blue-500:focus { --tw-ring-color: #3B82F6; }
.h-24 { height: 6rem; }
.justify-end { justify-content: flex-end; }
.gap-3 { gap: 0.75rem; }
.bg-gray-300 { background-color: #D1D5DB; }
.hover\:bg-gray-400:hover { background-color: #9CA3AF; }
.hover\:bg-green-600:hover {background-color: #097C33}
.hover\:bg-blue-600:hover { background-color: #2563EB; }
.transition { transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
/* Flexbox and spacing for buttons */
.d-flex { display: flex; }
.gap-2 { gap: 0.5rem; }
/* Hide/Show for responsiveness */
.d-none { display: none; }
.d-md-table { display: table; } /* Use table for desktop */
.d-block { display: block; }
.d-md-none { display: none; } /* Hide on desktop */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
</style>