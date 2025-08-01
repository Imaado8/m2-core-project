<template>
  <div class="leave-requests-content-wrapper">
    <div class="table-card bg-white rounded-xl shadow-lg">
      <h2 class="attendance-title text-center">Leave Requests</h2>
&nbsp;
      <!-- Search Bar -->
      <div class="mb-6 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search by Employee ID or Name..."
          class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:max-w-sm"
          v-model="searchQuery"
          @input="debouncedSearch"
        />
        <button
          class="btn-request-leave bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full md:w-auto"
          @click="showModal = true"> + Request Leave
        </button>
      </div>
&nbsp;
      <!-- Desktop Table View -->
      <div class="overflow-x-auto hidden md:block">
        <table class="styled-table w-full border-separate border-spacing-y-2 text-left text-sm text-gray-700">
          <thead class="bg-gray-100 rounded-lg">
            <tr>
              <th class="p-4 font-semibold rounded-tl-lg rounded-bl-lg">Employee ID</th>
              <th class="p-4 font-semibold">Employee Name</th>
              <th class="p-4 font-semibold">Leave Date</th>
              <th class="p-4 font-semibold">Reason</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold rounded-tr-lg rounded-br-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="leaveRequests.length === 0">
              <td colspan="6" class="text-center py-4 bg-white rounded-lg shadow-sm">No leave requests found.</td>
            </tr>
            <tr v-else v-for="request in leaveRequests" :key="request.id" class="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <td class="p-4 rounded-tl-lg rounded-bl-lg">{{ request.employeeId }}</td>
              <td class="p-4">{{ request.name }}</td>
              <td class="p-4">{{ formatDate( request.date) }}</td>
              <td class="p-4">{{ request.reason }}</td>
              <td class="p-4">
                <span :class="['px-3 py-1 rounded-full text-white font-bold text-xs', getStatusClass(request.status)]">
                  {{ request.status }}
                </span>
              </td>
              <td class="p-4 flex gap-2 rounded-tr-lg rounded-br-lg">
                <template v-if="request.status === 'Pending'">
                  <button
                    class="btn btn-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    @click="updateStatus(request.id, 'Approved')"
                  >
                    Accept
                  </button>
                  <button
                    class="btn btn-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    @click="updateStatus(request.id, 'Denied')"
                  >
                    Deny
                  </button>
                </template>
                <span v-else class="text-gray-500 italic">No action needed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Request Leave Modal -->
<div
  v-if="showModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  @click.self="showModal = false"
>
  <div
    class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
    @click.stop
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-xl font-semibold text-gray-800">Request Leave</h5>
      <button
        type="button"
        @click="showModal = false"
      >
        X
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitLeave">
      <!-- Select Employee -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Select Employee</label>
        <SearchDropdown :employees="employees" @select="handleEmployeeSelected" />
      </div>

      <!-- Leave Date -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Leave Date</label>
        <input
          type="date"
          v-model="form.date"
          class=" appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <!-- Reason -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Reason</label>
        <textarea
          v-model="form.reason"
          class=" appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          required
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          @click="showModal = false"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-100 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SearchDropdown from '@/components/SearchDropdown.vue';

// Data properties
const leaveRequests = ref([]);
const showModal = ref(false);
const form = ref({ name: '', date: '', reason: '', employeeId: '' });
const searchQuery = ref('');
const toastMessage = ref('');
const showToast = ref(false);
const toastTimeoutRef = ref(null);
const API_BASE_URL = 'http://localhost:3000'; // <--- IMPORTANT: Update this if your backend is elsewhere
const debouncedSearchTimeout = ref(null);
const employees = ref([
  { employeeId: 1, name: "Sibongile Nkosi" },
  { employeeId: 2, name: "Lungile Moyo" },
  { employeeId: 3, name: "Thabo Molefe" },
  { employeeId: 4, name: "Keshav Naidoo" },
  { employeeId: 5, name: "Zanele Khumalo" },
  { employeeId: 6, name: "Sipho Zulu" },
  { employeeId: 7, name: "Naledi Moeketsi" },
  { employeeId: 8 , name: "Farai Gumbo"},
  { employeeId: 9 , name: "Karabo Dlamini"},
  { employeeId: 10 , name: "Fatima Patel"},
]);

// Methods
const handleEmployeeSelected = (emp) => {
  form.value.employeeId = emp.employeeId;
  form.value.name = emp.name;
};

const showToastMessage = (message, duration = 3000) => {
  toastMessage.value = message;
  showToast.value = true;
  if (toastTimeoutRef.value) {
    clearTimeout(toastTimeoutRef.value);
  }
  toastTimeoutRef.value = setTimeout(() => {
    showToast.value = false;
    toastMessage.value = '';
  }, duration);
};

const fetchLeaveRequests = async () => {
  try {
    const url = searchQuery.value
      ? `${API_BASE_URL}/api/leave-requests?search=${encodeURIComponent(searchQuery.value)}`
      : `${API_BASE_URL}/api/leave-requests`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    leaveRequests.value = data;
    showToastMessage("Leave requests loaded!");
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    showToastMessage("Failed to load leave requests.");
  }
};

const debouncedSearch = () => {
  if (debouncedSearchTimeout.value) {
    clearTimeout(debouncedSearchTimeout.value);
  }
  debouncedSearchTimeout.value = setTimeout(() => {
    fetchLeaveRequests();
  }, 300);
};

const submitLeave = async () => {
  try {
    const newRequest = {
      employeeId: parseInt(form.value.employeeId),
      name: form.value.name,
      date: form.value.date,
      reason: form.value.reason,
    };

    const response = await fetch(`${API_BASE_URL}/api/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    showToastMessage("Leave request submitted successfully!");
    showModal.value = false;
    form.value = { name: '', date: '', reason: '', employeeId: '' };
    fetchLeaveRequests();
  } catch (error) {
    console.error("Error submitting leave request:", error);
    showToastMessage(`Failed to submit leave request: ${error.message}`);
  }
};

const updateStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leave-requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    showToastMessage(`Status updated to ${newStatus}!`);
    fetchLeaveRequests();
  } catch (error) {
    console.error("Error updating status:", error);
    showToastMessage(`Failed to update status: ${error.message}`);
  }
};

const getStatusClass = (status) => {
  const normalized = status.toLowerCase();
  if (normalized === "approved") return "bg-green-500";
  if (normalized === "pending") return "bg-yellow-500";
  if (normalized === "denied" || normalized === "rejected") return "bg-red-500";
  return "";
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  // Take only the YYYY-MM-DD part from the ISO string
  return dateString.split('T')[0];
};

// Lifecycle hook
onMounted(() => {
  fetchLeaveRequests();
});
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-100 {
  background-color: #f3f4f6;
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
.mt-1 {
  margin-top: 0.25rem;
}
.font-mono {
  font-family: monospace;
}

.leave-requests-content-wrapper { 
  padding: 2rem 1rem;
  background: #225c70;
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
  background: #fbf9f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.attendance-title {
  font-size: 1.8rem;
  color: #ffffff;
  background-color: #295c6d;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px; 
  margin: 0 auto;
}

.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  font-size: 1rem;
  color: #333;
  background-color: #fbf9f5;
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
  background-color: #f3f4f6;
  font-weight: 600;
}

.btn-request-leave {
  background-color: #708090;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}
.btn-request-leave:hover {
  background-color: #5a6770;
}

/* Vue Transition for Toast */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Tailwind CSS classes for status badges, defined in JS */
.bg-green-500 { background-color: #22c55e; }
.bg-yellow-500 { background-color: #eab308; }
.bg-red-500 { background-color: #ef4444; }
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
.text-gray-800 { color: #1f2937; }
.text-gray-400 { color: #9ca3af; }
.hover\:text-gray-600:hover { color: #4b5563; }
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
.focus\:ring-blue-500:focus { --tw-ring-color: #3b82f6; }
.h-24 { height: 6rem; }
.justify-end { justify-content: flex-end; }
.gap-3 { gap: 0.75rem; }
.bg-gray-300 { background-color: #d1d5db; }
.hover\:bg-gray-400:hover { background-color: #9ca3af; }
.bg-blue-600 { background-color: #2563eb; }
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