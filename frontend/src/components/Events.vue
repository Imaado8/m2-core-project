<template>
  <div class="summary-card p-4"> <h4>Upcoming Events</h4>
    <hr>
    <div class="events">
      <p v-for="event in upcomingEvents" :key="event.id">
        <span class="event-icon">📅</span> {{ event.date }} - {{ event.description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpcomingEvents', // Good practice to name your components
  data() {
    return {
      upcomingEvents: [
        { id: 1, date: '2025-07-15', description: 'Staff meeting @ 11:00 - 12:00' },
        { id: 2, date: '2025-06-25', description: 'AGM @ 10:30 - 11:00' },
        { id: 3, date: '2025-06-01', description: 'SERVER SHUTDOWN' }
      ]
    };
  }
};
</script>

<style scoped>
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

.summary-card h4 { 
   font-weight: bold;
  color: #295c6d;
}

.summary-card hr {
  border-color: #1b1a1a;
  margin-bottom: 1rem;
}

.events p {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #4a4a4a;
}

.event-icon {
  margin-right: 0.5rem;
}
</style>