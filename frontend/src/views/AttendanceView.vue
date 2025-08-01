<template>
  <div class="leave-requests-content-wrapper">
    <div class="table-card bg-white p-6 rounded-xl shadow-lg">
      <h4 class="attendance-title text-center">Employee Attendance</h4>
      <div class="overflow-x-auto hidden md:block">
        <table class="styled-table w-full border-separate border-spacing-y-2 text-left text-sm text-gray-700">
          <thead class="bg-gray-100 rounded-lg">
            <tr>
              <th class="p-4 font-semibold rounded-tl-lg rounded-bl-lg">Employee Name</th>
              <th class="p-4 font-semibold">Date</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold rounded-tr-lg rounded-br-lg">Actions</th>
            </tr>
          </thead>
          <tbody v-if="attendanceAndLeave.length">
            <template v-for="employee in attendanceAndLeave" :key="employee.employeeId">
              <tr v-for="(record, index) in employee.attendance" :key="employee.employeeId + '_' + record.date" class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200">
                <td v-if="index === 0" :rowspan="employee.attendance.length" class="p-4 rounded-tl-lg rounded-bl-lg">{{ employee.name }}</td>
                <td class="p-4">{{ formatDate(record.date) }}</td>
                <td class="p-4">
                  <span v-if="record.status" :class="['px-3 py-1 rounded-full text-white font-bold text-xs', getStatusClass(record.status)]" :title="`Status: ${record.status}`">{{ record.status }}</span>
                  <span v-else class="px-3 py-1 rounded-full bg-gray-300 text-gray-700 font-bold text-xs" title="No status recorded">—</span>
                </td>
                <td class="p-4 rounded-tr-lg rounded-br-lg">
                  <div class="flex gap-2">
                    <button class="btn btn-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200" @click="updateStatus(employee.employeeId, record.date, 'present')" title="Mark as Present">Present</button>
                    <button class="btn btn-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200" @click="updateStatus(employee.employeeId, record.date, 'absent')" title="Mark as Absent">Absent</button>
                    <button class="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200" @click="updateStatus(employee.employeeId, record.date, 'leave')" title="Mark as on Leave">Leave</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center py-4 bg-white rounded-lg shadow-sm">No attendance data available.</td>
            </tr>
          </tbody>
        </table>
      </div>
    <div class="flex justify-center mt-6">
  <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300" @click="saveAll">
    Save Changes
  </button>
</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      pendingUpdates: []
    };
  },
  computed: {
    ...mapState(['attendanceAndLeave']),
  },
  methods: {
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'present': return 'bg-green-500';
        case 'absent': return 'bg-red-500';
        case 'leave': return 'bg-yellow-500';
        default: return 'bg-gray-400';
      }
    },
    updateStatus(employeeId, date, newStatus) {
      const lowercaseStatus = newStatus.toLowerCase();

      const employee = this.attendanceAndLeave.find(emp => emp.employeeId === employeeId);
      if (employee) {
        const record = employee.attendance.find(r => r.date === date);
        if (record) {
          record.status = lowercaseStatus;
          const existing = this.pendingUpdates.find(update => update.employeeId === employeeId && update.date === date);
          if (existing) {
            existing.status = lowercaseStatus;
          } else {
            this.pendingUpdates.push({ employeeId, date, status: lowercaseStatus });
          }
        }
      }
    },
    async saveAll() {
      if (this.pendingUpdates.length === 0) return alert('No changes to save.');

      try {
        const response = await fetch('http://localhost:3000/api/attendance/bulk-update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates: this.pendingUpdates })
        });
        const data = await response.json();

        if (data.success) {
          this.pendingUpdates = [];
          alert('Attendance updated successfully!');
        } else {
          alert('Server error occurred.');
        }
      } catch (err) {
        console.error('Error saving attendance:', err);
        alert('Server error');
      }
    },
    formatDate(rawDate) {
      if (!rawDate) return '';
      const d = new Date(rawDate);
      return isNaN(d.getTime()) ? rawDate : d.toLocaleDateString('en-CA');
    },
    fetchAttendance() {
      fetch('http://localhost:3000/api/attendance')
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit('setAttendanceAndLeave', data);
        })
        .catch((err) => {
          console.error('Failed to load attendance:', err);
          this.$store.commit('setAttendanceAndLeave', []);
        });
    }
  },
  mounted() {
    this.fetchAttendance();
  }
};
</script>


<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-100 {
  background-color: #F3F4F6;
}
.font-inter {
  font-family: 'Inter', sans-serif;
}
.p-4 {
  padding: 1rem;
}
.md\:p-8 {
  padding: 2rem;
}
.bg-blue-700 {
  background-color: #1D4ED8;
}
.text-white {
  color: #fff;
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.rounded-b-lg {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: 700;
}
.text-center {
  text-align: center;
}
.mt-1 {
  margin-top: 0.25rem;
}
.font-mono {
  font-family: monospace;
}
.leave-requests-content-wrapper {
  padding: 2rem 1rem;
  background: #225C70;
  min-height: 100vh;
  max-width: 1250px;
  margin-left: 60px;
  color: #333;
}
@media (max-width: 768px) {
  .leave-requests-content-wrapper {
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
  margin: 0 auto; /* Added bottom margin */
}
.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem; /* Space between rows */
  font-size: 1rem;
  color: #333;
  background-color: #FBF9F5; /* Background for the table itself */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden; /* Ensures rounded corners are visible */
}
.styled-table th,
.styled-table td {
  padding: 1rem; /* Consistent padding */
  background-color: #fff; /* White background for cells */
  border-bottom: 1px solid #eee; /* Light separator */
  white-space: nowrap; /* Prevent text wrapping in cells by default */
  text-align: left;
}
.styled-table th {
  background-color: #F3F4F6; /* Lighter background for headers */
  font-weight: 600;
}
/* Specific border-radius for first/last cells in the row to match the overall table rounded corners */
.styled-table thead th:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.styled-table thead th:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.styled-table tbody tr:last-child td {
  border-bottom: none; /* No border for the last row's cells */
}
/* Row hover effect (from the provided leave requests component) */
.styled-table tbody tr:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* More pronounced shadow on hover */
  transform: translateY(-2px); /* Slight lift effect */
  transition: all 0.2s ease-in-out;
}
.bg-green-500 { background-color: #22C55E; }
.bg-yellow-500 { background-color: #EAB308; }
.bg-red-500 { background-color: #EF4444; }
.bg-gray-400 { background-color: #9CA3AF; } /* Default/No Status */
.rounded-full { border-radius: 9999px; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.font-bold { font-weight: 700; }
.text-white { color: #fff; }
/* Modal specific Tailwind classes */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bg-black { background-color: #000; }
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
.resize-none { resize: none; }
.justify-end { justify-content: flex-end; }
.gap-3 { gap: 0.75rem; }
.bg-gray-300 { background-color: #D1D5DB; }
.hover\:bg-gray-400:hover { background-color: #9CA3AF; }
.bg-blue-600 { background-color: #2563EB; }
.hover\:bg-blue-700:hover { background-color: #1D4ED8; }
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
/* Button styling (from the provided leave requests component) */
.btn {
  border: none;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.btn:active {
  transform: translateY(0);
  box-shadow: none;
}
/* Flexbox and spacing for buttons (from the provided leave requests component) */
.flex { display: flex; }
.gap-2 { gap: 0.5rem; }
/* No data message styling (from the provided leave requests component) */
.text-center { text-align: center; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.bg-white { background-color: #fff; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
/* Responsive adjustments */
@media (max-width: 768px) {
  .attendance-title {
    font-size: 1.4rem;
    padding: 12px;
  }
  /* Table becomes scrollable on small screens */
  .overflow-x-auto {
    overflow-x: auto;
  }
  .styled-table th,
  .styled-table td {
    padding: 0.75rem 0.5rem; /* Reduced padding */
    font-size: 0.9rem; /* Smaller font size */
    white-space: normal; /* Allow wrapping */
  }
  .btn {
    font-size: 0.8rem;
    padding: 0.375rem 0.625rem; /* Smaller buttons */
  }
}
</style>








