<template>
  <div class="performance-wrapper">
    <div class="performance-card shadow-sm p-4 bg-white rounded">
      <h2 class="text-center performance-title">Performance Reviews</h2>
      &nbsp;
      <div class="table-responsive">
        <table class="table table-bordered table-striped styled-table">
          <thead class="table-header">
            <tr>
              <th>EMPLOYEE NAME</th>
              <th>POSITION</th>
              <th>DEPARTMENT</th>
              <th>EXCELLENT</th>
              <th>SATISFACTORY</th>
              <th>UNSATISFACTORY</th>
              <th>HR COMMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in editableReviews" :key="employee.employee_id">
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department }}</td>

              <td><input type="checkbox" v-model="employee.excellent" /></td>
              <td><input type="checkbox" v-model="employee.satisfactory" /></td>
              <td><input type="checkbox" v-model="employee.unsatisfactory" /></td>

              <td>
                <input
                  type="text"
                  v-model="employee.hr_comment"
                  placeholder="Enter comment..."
                  class="form-control"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Save button -->
      <div class="text-center mt-3">
        <button class="btn btn-success" @click="saveReviews">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      editableReviews: []
    };
  },
  mounted() {
    axios.post('http://localhost:3000/api/performance/seed')
      .then(() => axios.get('http://localhost:3000/api/performance/reviews'))
      .then(response => {
        this.editableReviews = response.data.map(r => ({
          ...r,
          excellent: !!r.excellent,
          satisfactory: !!r.satisfactory,
          unsatisfactory: !!r.unsatisfactory
        }));
      })
      .catch(err => {
        console.error('Seeding or loading failed:', err);
      });
  },
  methods: {
    async saveReviews() {
      try {
        await axios.post('http://localhost:3000/api/performance/save', this.editableReviews);
        alert('Performance reviews saved successfully!');
      } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save performance reviews');
      }
    }
  }
};
</script>

<style scoped>
.performance-wrapper {
  padding: 2rem 1rem;
  background: #225c70;
  min-height: 100vh;
  max-width: 1250px;
  margin-left: 60px;
  color: #333;
}
.performance-card {
  background: #fbf9f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
.performance-title {
  font-size: 1.8rem;
  color: #ffffff;
  background-color: #295c6d;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .performance-wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
.styled-table {
  background-color: #fbf9f5;
  border-collapse: separate;
  border-spacing: 0 0.3rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.95rem;
}
.table-header th {
  background-color: #fbf9f5;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
}
.styled-table td,
.styled-table th {
  padding: 12px;
  text-align: center;
  vertical-align: middle;
  background-color: white;
}
input[type="checkbox"] {
  transform: scale(1.3);
  cursor: pointer;
}
</style>
