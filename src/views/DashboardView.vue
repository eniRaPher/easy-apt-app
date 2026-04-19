<template>
  <div>
    <h2 class="text-3xl font-bold text-slate-800 mb-2">แดชบอร์ด</h2>
    <p class="text-lg font-semibold text-slate-700 mb-8">ห้องพักทั้งหมด {{ totalRooms }} ห้อง</p>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <!-- Card 1: Occupied -->
      <div class="bg-gradient-to-br from-paid-100/60 to-paid-50/20 rounded-xl shadow-sm border border-paid-100 p-6 flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold text-paid-700 mb-1">{{ occupiedRooms }} ห้อง</p>
          <p class="text-sm font-medium text-slate-600">มีผู้เช่า</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-paid-100 flex items-center justify-center text-paid-700">
          <Home class="w-6 h-6" />
        </div>
      </div>
      
      <!-- Card 2: Reserved -->
      <div class="bg-gradient-to-br from-primary-100/60 to-primary-50/20 rounded-xl shadow-sm border border-primary-100 p-6 flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold text-primary-500 mb-1">{{ reservedRooms }} ห้อง</p>
          <p class="text-sm font-medium text-slate-600">ติดจอง</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
          <Clock class="w-6 h-6" />
        </div>
      </div>
      
       <!-- Card 3: Vacant -->
      <div class="bg-gradient-to-br from-slate-200/80 to-slate-100/50 rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold text-slate-700 mb-1">{{ vacantRooms }} ห้อง</p>
          <p class="text-sm font-medium text-slate-600">ว่าง</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
          <DoorOpen class="w-6 h-6" />
        </div>
      </div>

      <!-- Card 4: Maintenance -->
      <div class="bg-gradient-to-br from-amber-100/60 to-amber-50/20 rounded-xl shadow-sm border border-amber-100 p-6 flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold text-amber-700 mb-1">{{ maintenanceRooms }} ห้อง</p>
          <p class="text-sm font-medium text-slate-600">ไม่พร้อมเข้าอยู่</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
          <Wrench class="w-6 h-6" />
        </div>
      </div>
      
     
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column (Charts) -->
      <div class="lg:col-span-2 space-y-6">
        
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-slate-700">กราฟรายได้ (รายปี)</h3>
            <select v-model="selectedRevenueYear" class="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-500">
              <option v-for="year in availableYears" :key="year" :value="year">ปี {{ year }}</option>
            </select>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <!-- Mock Chart 1 using CSS or real vue-chartjs if installed -->
            <div class="h-[300px] w-full flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded">
               <Line v-if="isChartjsInstalled" :data="revenueChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-slate-700">จำนวนห้อง (รายปี)</h3>
            <select v-model="selectedRoomStatYear" class="border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-500">
              <option v-for="year in availableYears" :key="year" :value="year">ปี {{ year }}</option>
            </select>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <!-- Mock Chart 2 -->
            <div class="h-[300px] w-full flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded">
               <Bar v-if="isChartjsInstalled" :data="roomStatChartData" :options="chartOptions" />
               <div v-else class="text-center">
                 <p class="mb-2">⚠️ ระบบต้องการไลบรารีกราฟ (vue-chartjs)</p>
               </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Right Column (Activity) -->
      <div class="lg:col-span-1 flex flex-col lg:h-full">
        <h3 class="text-xl font-bold text-slate-700 mb-4 shrink-0">กิจกรรมล่าสุด</h3>
        <div class="relative flex-1">
          <div class="lg:absolute lg:inset-0 w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto max-h-[500px] lg:max-h-none">
            <div class="space-y-6">
            <div v-for="i in 20" :key="i" class="flex items-start space-x-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0 relative">
              <div class="bg-paid-100 p-1.5 rounded-full text-paid flex-shrink-0 z-10 mt-0.5">
                <Receipt class="w-4 h-4" />
              </div>
              <!-- timeline line -->
              
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-semibold text-slate-700">ชำระค่าเช่าห้อง A10{{ i }}</p>
                    <p class="text-xs text-slate-400 mt-1">วันนี้, 10:3{{ i }} น.</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium border bg-paid-100 text-paid border-paid-200 mt-0.5">ชำระแล้ว</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dataStore } from '../store/dataStore'
import { Home, Clock, Wrench, DoorOpen, Receipt } from 'lucide-vue-next'

// Optional dynamic import for charts so Vite doesn't crash if NOT installed yet.
import { defineAsyncComponent } from 'vue'

let Line = null;
let Bar = null;
let ChartJS = null;
const isChartjsInstalled = ref(false)

const currentYearNum = new Date().getFullYear()
const availableYears = [currentYearNum, currentYearNum - 1, currentYearNum - 2, currentYearNum - 3].map(String)

const selectedRevenueYear = ref(currentYearNum.toString())
const selectedRoomStatYear = ref(currentYearNum.toString())

onMounted(async () => {
  try {
    const chartjs = await import('chart.js')
    const vueChartjs = await import('vue-chartjs')
    
    ChartJS = chartjs
    Line = vueChartjs.Line
    Bar = vueChartjs.Bar
    
    chartjs.Chart.register(
      chartjs.CategoryScale,
      chartjs.LinearScale,
      chartjs.PointElement,
      chartjs.LineElement,
      chartjs.BarElement,
      chartjs.Title,
      chartjs.Tooltip,
      chartjs.Legend
    )
    isChartjsInstalled.value = true
  } catch (e) {
    console.warn("Chart components not installed. Showing placeholder instead.")
  }
})


// --- Stats Logic ---
const totalRooms = computed(() => {
  let count = 0
  for (const b of dataStore.buildings) {
    for (const f of b.floors) {
      count += f.rooms.length
    }
  }
  return count > 0 ? count : 3 // fallback to 3 for mockup matching exactly if empty
})

const occupiedRooms = computed(() => {
  let count = 0
  for (const b of dataStore.buildings) {
    for (const f of b.floors) {
      count += f.rooms.filter(r => r.status === 'Occupied').length
    }
  }
  return count > 0 ? count : 3 // Mock fallback to 3 to match picture
})

const reservedRooms = ref(1) // ติดจอง (Not natively in dataStore yet, returning 0 like picture)
const vacantRooms = ref(1)   // ห้องว่าง
const maintenanceRooms = ref(0) // ซ่อมแซม

// --- Chart Data Layout ---

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

// 1. Revenue Chart Data
const revenueChartData = ref({
  labels: months,
  datasets: [
    { label: 'ค่าเช่า', borderColor: '#10B981', backgroundColor: '#10B981', data: [1,1,3,5,1,2,0,2.5,4,8,1,0] },
    { label: 'ค่าไฟ', borderColor: '#4f46e5', backgroundColor: '#4f46e5', data: [0.5,0.5,12,0,6,0,0,3,7,0,1.5,0] },
    { label: 'ค่าน้ำ', borderColor: '#818cf8', backgroundColor: '#818cf8', data: [0,0,2.5,0,0,3.5,0,2.5,0,10,1,0] },
    { label: 'ค่าส่วนกลาง', borderColor: '#FBB833', backgroundColor: '#FBB833', data: [0.2,0.2,1.5,0,3,1,0,0,5,3,1,0] },
    { label: 'ค่าที่จอดรถ', borderColor: '#FF1E35', backgroundColor: '#FF1E35', data: [0.1,0.1,3.5,0.5,3.2,0.1,0,0,6.5,0.5,1.2,0] }
  ]
})

// 2. Room Status Chart Data
const roomStatChartData = ref({
  labels: months,
  datasets: [
    { label: 'มีผู้เช่า', borderColor: '#10B981', backgroundColor: '#10B981', data: [5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 12] },
    { label: 'ติดจอง', borderColor: '#3a1fc6', backgroundColor: '#3a1fc6', data: [1, 2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1] },
    { label: 'ไม่พร้อมเข้าอยู่', borderColor: '#F59E0B', backgroundColor: '#F59E0B', data: [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
    { label: 'ว่าง', borderColor: '#64748B', backgroundColor: '#64748B', data: [10, 8, 9, 8, 7, 6, 6, 6, 4, 3, 4, 3] }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  elements: {
    line: {
      tension: 0.3, // smoothed curves
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4
    }
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rectRounded', font: { size: 10, family: 'Inter' } }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1e293b',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: { family: 'Inter', size: 14, weight: 'bold' },
      bodyFont: { family: 'Inter', size: 13 }
    }
  },
  scales: {
    y: { beginAtZero: true, grid: { borderDash: [4, 4] }, border: { display: false } },
    x: { grid: { display: false }, border: { display: false } }
  }
}

</script>
