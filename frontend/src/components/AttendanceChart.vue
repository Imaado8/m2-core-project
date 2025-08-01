<template>
  <div style="max-width: 300px; margin: 0 auto;">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  performanceData: {
    type: Object,
    required: true,
    default: () => ({ excellent: 0, satisfactory: 0, poor: 0 })
  }
})

const chartData = computed(() => ({
  labels: ['Excellent', 'Satisfactory', 'Poor'],
  datasets: [
    {
      label: 'Performance Overview',
      data: [
        props.performanceData.excellent || 3,
        props.performanceData.satisfactory || 5,
        props.performanceData.poor || 2
      ],
      backgroundColor: ['#16a34a', '#facc15', '#ef4444'],
      borderWidth: 1
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Employee Performance Breakdown'
    }
  }
}
</script>
