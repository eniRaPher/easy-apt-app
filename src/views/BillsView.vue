<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">รายการบิล</h2>
      <div class="flex space-x-3">
        <button @click="createNewBill" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center space-x-2">
          <Plus class="w-4 h-4" />
          <span>สร้างบิลใหม่</span>
        </button>
      </div>
    </div>

    <!-- Dashboard Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">ร่าง (Draft)</p>
          <p class="text-2xl font-bold text-slate-800">{{ billsCounts.Draft }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-draft-100 flex items-center justify-center text-draft">
          <FileEdit class="w-6 h-6" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">รอชำระ (Pending)</p>
          <p class="text-2xl font-bold text-pending">{{ billsCounts.Pending }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-pending-100 flex items-center justify-center text-pending">
          <Clock class="w-6 h-6" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">ชำระแล้ว (Paid)</p>
          <p class="text-2xl font-bold text-paid">{{ billsCounts.Paid }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-paid-100 flex items-center justify-center text-paid">
          <CheckCircle class="w-6 h-6" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">ยกเลิก (Cancelled)</p>
          <p class="text-2xl font-bold text-cancelled">{{ billsCounts.Cancelled }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-cancelled-100 flex items-center justify-center text-cancelled">
          <XCircle class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row items-center justify-between gap-4">
      
      <!-- Left side: Filters -->
      <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full xl:w-auto">
        <div class="flex items-center space-x-2">
          <div class="p-2 bg-primary-50 text-primary-600 rounded-lg">
            <Filter class="w-5 h-5" />
          </div>
          <span class="text-sm font-bold text-slate-700 whitespace-nowrap">คัดกรองบิล:</span>
        </div>
        
        <!-- Month Filter -->
        <div class="relative w-full sm:w-auto">
          <input 
            type="month" 
            v-model="filterMonth" 
            class="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none cursor-pointer"
          />
          <button v-if="filterMonth" @click="filterMonth = ''" class="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-50 px-1" title="ล้างตัวกรองเดือน">
            &times;
          </button>
        </div>
        
        <!-- Status Filter -->
        <select v-model="filterStatus" class="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none" :class="filterStatus === 'Paid' ? 'text-paid' : filterStatus === 'Pending' ? 'text-pending' : filterStatus === 'Cancelled' ? 'text-cancelled' : 'text-draft'">
          <option value="all" class="text-slate-700">ทุกสถานะ (All Status)</option>
          <option value="Draft" class="text-draft">ร่าง (Draft)</option>
          <option value="Pending" class="text-pending">รอชำระ (Pending)</option>
          <option value="Paid" class="text-paid">ชำระแล้ว (Paid)</option>
          <option value="Cancelled" class="text-cancelled">ยกเลิก (Cancelled)</option>
        </select>
      </div>

      <!-- Right side: Search Input -->
      <div class="flex items-center w-full xl:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" v-model="searchBillText" placeholder="ค้นหารหัสบิล, ห้อง..." class="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-full bg-slate-50">
        </div>
      </div>
      
    </div>
    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">รหัส (Code)</th>
              <th class="px-6 py-4">ห้อง</th>
              <th class="px-6 py-4">วันที่สร้าง</th>
              <th class="px-6 py-4 text-right">ค่าเช่า</th>
              <th class="px-6 py-4 text-right">ค่ามิเตอร์ (ไฟ)</th>
              <th class="px-6 py-4 text-right">ค่าน้ำ</th>
              <th class="px-6 py-4 text-right">ค่าอื่นๆ</th>
              <th class="px-6 py-4 text-right">ยอดรวม</th>
              <th class="px-6 py-4">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="bill in filteredBills" :key="bill.id" @click="openVerifyModal(bill)" class="hover:bg-slate-50 transition-colors cursor-pointer">
              <td class="px-6 py-4 font-medium text-primary-600">{{ bill.code }}</td>
              <td class="px-6 py-4 font-bold text-slate-800">{{ bill.room }}</td>
              <td class="px-6 py-4">{{ bill.createdAt }}</td>
              <td class="px-6 py-4 text-right">฿{{ bill.rent.toLocaleString() }}</td>
              <td class="px-6 py-4 text-right">฿{{ bill.electric.toLocaleString() }}</td>
              <td class="px-6 py-4 text-right">฿{{ bill.water.toLocaleString() }}</td>
              <td class="px-6 py-4 text-right text-slate-500">฿{{ bill.otherFees?.reduce((sum, f) => sum + f.amount, 0).toLocaleString() || '0' }}</td>
              <td class="px-6 py-4 text-right font-bold text-slate-800">฿{{ bill.total.toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap',
                  bill.status === 'Draft' ? 'bg-draft-100 text-draft border-draft-200' : 
                  bill.status === 'Pending' ? 'bg-pending-100 text-pending border-pending-200' : 
                  bill.status === 'Paid' ? 'bg-paid-100 text-paid border-paid-200' : 
                  bill.status === 'Cancelled' ? 'bg-cancelled-100 text-cancelled border-cancelled-200' : 'bg-slate-100 text-slate-700'
                ]">
                  {{ 
                    bill.status === 'Draft' ? 'ร่าง' : 
                    bill.status === 'Pending' ? 'รอชำระ' : 
                    bill.status === 'Paid' ? 'ชำระแล้ว' : 
                    bill.status === 'Cancelled' ? 'ยกเลิก' : bill.status 
                  }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredBills.length === 0">
              <td colspan="9" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <FileX class="w-12 h-12 mb-3 text-slate-300" />
                  <p class="text-lg font-bold text-slate-600">ไม่พบบิล</p>
                  <p class="text-sm">ไม่มีบิลที่ตรงกับตัวกรองที่คุณเลือก กรุณาลองเปลี่ยนตัวเลือกใหม่</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    
    <!-- Select Customer Modal (Create Bill) -->
    <div v-if="isCreateBillModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800 flex items-center">
            <Receipt class="w-5 h-5 mr-2 text-primary-600" />
            สร้างบิลใหม่
          </h3>
          <button @click="isCreateBillModalOpen = false" class="text-slate-400 hover:text-slate-600"><X class="w-5 h-5"/></button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-semibold text-slate-700 mb-2">เลือกผู้เช่า / ห้อง</label>
          <select v-model="selectedCustomerForNewBill" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-medium">
            <option value="" disabled>-- กรุณาเลือก --</option>
            <option v-for="c in availableCustomers" :key="c.id" :value="c">ห้อง {{ c.room }} - {{ c.name }}</option>
          </select>
          <p class="text-xs text-slate-500 mt-2">ค่าที่จอดรถจะถูกดึงข้อมูลจากลูกค้าที่เลือกอัตโนมัติ</p>
        </div>
        <div class="px-6 py-4 bg-slate-50 flex justify-end space-x-3 gap-2 border-t border-slate-100">
          <button @click="isCreateBillModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button :disabled="!selectedCustomerForNewBill" @click="confirmCreateNewBill" class="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">สร้างบิลเปล่า</button>
        </div>
      </div>
    </div>

    <!-- Bill Detail Modal -->
    <BillDetailModal
      :is-open="isVerifyModalOpen"
      :bill="selectedBill"
      @close="closeVerifyModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Download, Filter, FileX, FileEdit, Clock, CheckCircle, XCircle, Send, X, Receipt, Search } from 'lucide-vue-next'
import BillDetailModal from '../components/BillDetailModal.vue'
import { settingsStore } from '../store/settingsStore'
import { dataStore } from '../store/dataStore'

const isVerifyModalOpen = ref(false)
const selectedBill = ref(null)

const openVerifyModal = (bill) => {
  selectedBill.value = bill
  isVerifyModalOpen.value = true
}

const closeVerifyModal = () => {
  isVerifyModalOpen.value = false
}

const filterMonth = ref('')
const filterStatus = ref('all')
const searchBillText = ref('')

const bills = computed(() => dataStore.bills)

const billsCounts = computed(() => {
  return {
    Draft: bills.value.filter(b => b.status === 'Draft').length,
    Pending: bills.value.filter(b => b.status === 'Pending').length,
    Paid: bills.value.filter(b => b.status === 'Paid').length,
    Cancelled: bills.value.filter(b => b.status === 'Cancelled').length
  }
})

const isCreateBillModalOpen = ref(false)
const selectedCustomerForNewBill = ref('')

const availableCustomers = computed(() => dataStore.customers)

const createNewBill = () => {
  selectedCustomerForNewBill.value = ''
  isCreateBillModalOpen.value = true
}

const confirmCreateNewBill = () => {
  const customer = selectedCustomerForNewBill.value
  const newId = bills.value.length + 1
  const todayStr = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
  const yyyyMm = new Date().toISOString().slice(0, 7)
  
  // Clone current global settings so future changes don't corrupt this bill
  const snapshotElecRate = settingsStore.elecRate
  const snapshotWaterRate = settingsStore.waterRate
  const snapshotOtherFees = JSON.parse(JSON.stringify(settingsStore.otherFees))
  
  // Find parking fee
  const zoneId = customer.parkingZone
  const parkingZoneSetting = settingsStore.parkingZones.find(z => z.id === zoneId)
  const parkingFee = parkingZoneSetting ? parkingZoneSetting.rate : 0

  const otherTotal = snapshotOtherFees.reduce((acc, f) => acc + f.amount, 0)
  
  dataStore.bills.unshift({
    id: newId,
    code: `INV-NEW-${newId.toString().padStart(3, '0')}`,
    room: customer.room,
    createdAt: todayStr,
    monthCode: yyyyMm,
    month: 'เดือนปัจจุบัน',
    rent: 4500, electric: 0, water: 0, 
    elecRate: snapshotElecRate,
    waterRate: snapshotWaterRate,
    otherFees: snapshotOtherFees,
    parkingFee: parkingFee,
    total: 4500 + otherTotal + parkingFee,
    status: 'Draft'
  })
  isCreateBillModalOpen.value = false
}

const filteredBills = computed(() => {
  const query = searchBillText.value.toLowerCase()
  return bills.value.filter(bill => {
    // If filterMonth is empty, show all. Otherwise match with bill.monthCode.
    const matchMonth = !filterMonth.value || bill.monthCode === filterMonth.value
    const matchStatus = filterStatus.value === 'all' || bill.status === filterStatus.value
    const matchSearch = !query || 
      String(bill.code).toLowerCase().includes(query) || 
      String(bill.room).toLowerCase().includes(query)
      
    return matchMonth && matchStatus && matchSearch
  })
})
</script>
