<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-card">
      <h2 class="dashboard-title text-center">HR Dashboard</h2>
      &nbsp;
      <div class="row mb-4">
        <div class="col-md-3" v-for="item in stats" :key="item.label">
          <div class="card summary-card text-white">
            <div class="card-body text-center">
              <h5 class="card-title">{{ item.label }}</h5>
              <p class="card-text fs-4">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="welcome-message text-center mb-4">
        <h4>Welcome Back!</h4>
        <p>Have a productive day managing your HR system</p>
      </div>

      <div class="chart d-flex justify-content-between">
        <div class="chart-item">
          <AttendanceChart :stats="attendanceStats" />
        </div>
        <div class="chart-item">
          <Events />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AttendanceChart from "@/components/AttendanceChart.vue"
import Events from '@/components/Events.vue' 

export default {
  components: {
    AttendanceChart,
    Events,
  },
  computed: {
    ...mapState(['employeeInformation', 'attendanceAndLeave']),

    attendanceStats() {
      let present = 0
      let absent = 0
      let leave = 0

      this.attendanceAndLeave.forEach(employee => {
        if (Array.isArray(employee.leaveRequests)) {
          employee.leaveRequests.forEach(req => {
            const status = req.status?.toLowerCase()
            if (status === 'approved') leave++
            else if (status === 'rejected') absent++ // Assuming rejected is considered absent for this count
            else if (status === 'present') present++
          })
        }
      })

      return { present, absent, leave }
    },

    stats() {
      const totalEmployees = this.employeeInformation.length
      let employeesOnLeave = 0
      let pendingLeaveDays = 0
      let pendingPayments = 3 // This seems to be a hardcoded number

      this.attendanceAndLeave.forEach(employee => {
        if (Array.isArray(employee.leaveRequests)) {
          employee.leaveRequests.forEach(req => {
            const status = req.status?.toLowerCase()
            if (status === 'approved') employeesOnLeave++
            if (status === 'pending') pendingLeaveDays++
          })
        }
      })

      return [
        { label: "Total Employees", value: totalEmployees },
        { label: "Employees on Leave", value: employeesOnLeave },
        { label: "Pending Leave Days", value: pendingLeaveDays },
        { label: "Pending Payments", value: pendingPayments }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log("Refreshing (reactive data, no action needed)")
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  padding: 2rem 1rem;
  background: #225c70;
  min-height: 100vh;
  max-width: 1250px;
  margin-left: 60px;
  color: #333;
}

.dashboard-card {
  background: #fbf9f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  font-size: 1.8rem;
  color: #ffffff;
  background-color: #295c6d;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.card-title{
  font-size: medium;
}

.welcome-message h4 {
  font-weight: bold;
  color: #295c6d;
}

.welcome-message p {
  color: #4a4a4a;
}

.summary-card {
  background-color: #fbf9f5 !important;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #333;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.summary-card .card-title {
  color: #222;
  font-weight: 600;
}

.summary-card .card-text {
  color: #555;
  font-size: 1.5rem;
  font-weight: bold;
}

.chart {
  display: flex; /* Use flexbox for layout */
  justify-content: space-between; /* Space between items */
  align-items: flex-start; /* Align items at the start */
}
.chart-item {
  flex: 1; /* Allow items to grow equally */
  margin: 0 10px; /* Add some margin between items */
}

</style>