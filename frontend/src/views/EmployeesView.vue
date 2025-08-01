<template>
  <div class="employee-wrapper">
    <div class="employee-card p-4">
      <h2 class="employee-title text-center">Employee Directory</h2>
      &nbsp;
      <button class="btn btn-request-leave mt-2" @click="openAddEmployeeModal"> + Add Employee
      </button>

      <div class="flex-card-container">
        <div
          v-for="employee in employees"
          :key="employee.employee_id"
          class="employee-card card-container"
        >
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front card text-center">
                <h5 class="card-title fs-6 mb-2">{{ employee.name }}</h5>
                <p class="card-subtitle text-muted small">{{ employee.position }}</p>
              </div>
              <div class="flip-card-back card text-white p-4 small">
                <p><strong>Dept:</strong> {{ employee.department }}</p>
                <p><strong>Email:</strong> {{ employee.email }}</p>
                <p><strong>History:</strong> {{ employee.employment_history }}</p>
                <p><strong>Salary:</strong> R{{ Number(employee.salary || 0).toLocaleString() }}</p>
                <button class="btn btn-delete mt-2" @click="deleteEmployee(employee.employee_id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showForm = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h5 class="text-xl font-semibold text-gray-800">Add New Employee</h5>
            <button type="button"@click="showForm = false">X</button>
          </div>

          <form @submit.prevent="handleFormSubmit">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <div class="flex-1">
                <label class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  v-model="form.name"
                  class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input type="email" v-model="form.email"class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"required/>
              </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <div class="flex-1">
                <label class="block text-gray-700 text-sm font-bold mb-2">Position:</label>
                <input
                  type="text"
                  v-model="form.position"
                  class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-gray-700 text-sm font-bold mb-2">Department:</label>
                <input
                  type="text"
                  v-model="form.department"
                  class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Employment History:</label>
              <textarea
                v-model="form.employment_history"
                class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              ></textarea>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2">Salary:</label>
              <input
                type="number"
                v-model="form.salary"
                class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            &nbsp;
            <div class="flex justify-end gap-3">
              <button
                type="button"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                @click="showForm = false"
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showForm: false, // This is correctly initialized
      employees: [
        // Your initial employee data
        { name: 'Sibongile Nkosi', position: 'Software Engineer', department: 'Development', email: 'sibongile.nkosi@moderntech.com', employment_history: 'Joined in 2015, promoted to Senior in 2018', salary: 70000.00 },
        { name: 'Lungile Moyo', position: 'HR Manager', department: 'HR', email: 'lungile.moyo@moderntech.com', employment_history: 'Joined in 2013, promoted to Manager in 2017', salary: 80000.00 },
        { name: 'Thabo Molefe', position: 'Quality Analyst', department: 'QA', email: 'thabo.molefe@moderntech.com', employment_history: 'Joined in 2018', salary: 55000.00 },
        { name: 'Keshav Naidoo', position: 'Sales Representative', department: 'Sales', email: 'keshav.naidoo@moderntech.com', employment_history: 'Joined in 2020', salary: 60000.00 },
        { name: 'Zanele Khumalo', position: 'Marketing Specialist', department: 'Marketing', email: 'zanele.khumalo@moderntech.com', employment_history: 'Joined in 2019', salary: 58000.00 },
        { name: 'Sipho Zulu', position: 'UI/UX Designer', department: 'Design', email: 'sipho.zulu@moderntech.com', employment_history: 'Joined in 2016', salary: 65000.00 },
        { name: 'Naledi Moeketsi', position: 'DevOps Engineer', department: 'IT', email: 'naledi.moeketsi@moderntech.com', employment_history: 'Joined in 2017', salary: 72000.00 },
        { name: 'Farai Gumbo', position: 'Content Strategist', department: 'Marketing', email: 'farai.gumbo@moderntech.com', employment_history: 'Joined in 2021', salary: 56000.00 },
        { name: 'Karabo Dlamini', position: 'Accountant', department: 'Finance', email: 'karabo.dlamini@moderntech.com', employment_history: 'Joined in 2018', salary: 62000.00 },
        { name: 'Fatima Patel', position: 'Customer Support Lead', department: 'Support', email: 'fatima.patel@moderntech.com', employment_history: 'Joined in 2016', salary: 58000.00 }
      ],
      form: {
        name: '',
        position: '',
        department: '',
        email: '',
        employment_history: '',
        salary: ''
      }
    }
  },
  async mounted() {
    await this.fetchEmployees()
  },
  methods: {
    // New method to open the modal and log state
    openAddEmployeeModal() {
      this.showForm = true;
      console.log('💡 showForm set to:', this.showForm); // Log to see if it changes
    },
    async fetchEmployees() {
      try {
        const res = await axios.get('http://localhost:3000/api/employees')
        this.employees = res.data
        console.log("✅ Fetched employees successfully.");
      } catch (error) {
        console.error('❌ Error fetching employees:', error.response ? error.response.data : error.message);
      }
    },
    async handleFormSubmit() {
      try {
        const newEmployee = {
          name: this.form.name,
          position: this.form.position,
          department: this.form.department,
          email: this.form.email,
          employment_history: this.form.employment_history,
          salary: parseFloat(this.form.salary)
        }
        console.log("Attempting to add new employee:", newEmployee);

        await axios.post('http://localhost:3000/api/employees', newEmployee)

        this.showForm = false
        // Reset form fields
        this.form = {
          name: '',
          position: '',
          department: '',
          email: '',
          employment_history: '',
          salary: ''
        }

        await this.fetchEmployees()
        console.log("✅ Employee added successfully and list refreshed")
      } catch (error) {
        console.error('❌ Error adding employee:', error.response ? error.response.data : error.message)
      }
    },
    async deleteEmployee(id) {
      try {
        await axios.delete(`http://localhost:3000/api/employees/${id}`)
        await this.fetchEmployees()
        console.log("🗑️ Employee deleted and list refreshed")
      } catch (error) {
        console.error('❌ Error deleting employee:', error.response ? error.response.data : error.message)
      }
    }
  }
}
</script>

<style scoped>
.employee-wrapper {
  padding: 2rem 1rem;
  background: #225c70;
  min-height: 100vh;
  max-width: 1250px;
  margin-left: 60px;
  color: #333;
}

.employee-card {
  background: #fbf9f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.employee-title {
  font-size: 1.8rem;
  color: #ffffff;
  background-color: #295c6d;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.flex-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.card-container {
  flex: 0 0 calc(20% - 1rem);
  height: 300px;
}

@media (max-width: 1200px) {
  .card-container {
    flex: 0 0 calc(25% - 1rem);
  }
}
@media (max-width: 992px) {
  .card-container {
    flex: 0 0 calc(33.33% - 1rem);
  }
}
@media (max-width: 768px) {
  .card-container {
    flex: 0 0 calc(50% - 1rem);
  }
}
@media (max-width: 576px) {
  .card-container {
    flex: 0 0 100%;
  }
}

.flip-card {
  perspective: 900px;
  height: 50%;
  width: 230px;
  height: 230px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 240px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 240px;
  height: 240px;
}
.flip-card-back {
  transform: rotateY(180deg);
  background-color: #295c6d;
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

.flip-card-front .card-title {
  font-size: 0.95rem;
}
.flip-card-front .card-subtitle {
  font-size: 0.75rem;
}
.flip-card-back p {
  font-size: 0.75rem;
  line-height: 1.2rem;
}
.btn-delete {
  background-color: #708090;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  font-size: 0.6rem;
  border-radius: 3px;
  margin-top: -20px;
  transition: background-color 0.3s ease;
}
.btn-delete:hover {
  background-color: #5a6770;
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