<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">รายชื่อลูกค้า</h2>
      <button @click="openModal('add')" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center space-x-2">
        <Plus class="w-4 h-4" />
        <span>เพิ่มลูกค้า</span>
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row items-center justify-between gap-4">
      <!-- Left side: Filters -->
      <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full xl:w-auto">
        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <div class="p-2 bg-primary-50 text-primary-600 rounded-lg">
            <Filter class="w-5 h-5" />
          </div>
          <span class="text-sm font-bold text-slate-700 whitespace-nowrap">คัดกรองลูกค้า:</span>
        </div>
        <select v-model="filterStatus" class="w-full sm:w-auto bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none" :class="filterStatus === 'Active' ? 'text-green-700' : filterStatus === 'Inactive' ? 'text-red-700' : 'text-slate-700'">
          <option value="all" class="text-slate-700">ทุกสถานะ (All Status)</option>
          <option value="Active" class="text-green-700">ผู้เช่าปัจจุบัน</option>
          <option value="Inactive" class="text-red-700">ย้ายออก</option>
        </select>
      </div>

      <!-- Right side: Search -->
      <div class="flex items-center w-full xl:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="ค้นหาชื่อ, ห้อง, เบอร์, ทะเบียน..." 
            class="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none block rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">ชื่อ - นามสกุล</th>
              <th class="px-6 py-4">เลขบัตรประชาชน</th>
              <th class="px-6 py-4">ห้อง</th>
              <th class="px-6 py-4">เบอร์โทรศัพท์</th>
              <th class="px-6 py-4">สถานะ</th>
              <th class="px-6 py-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase">
                  {{ customer.name.charAt(0) }}
                </div>
                <span>{{ customer.name }}</span>
              </td>
              <td class="px-6 py-4">{{ customer.idCard || '-' }}</td>
              <td class="px-6 py-4">{{ customer.room }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ customer.phone }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                  customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ customer.status === 'Active' ? 'ผู้เช่าปัจจุบัน' : 'ย้ายออก' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-3">
                <button @click="openModal('edit', customer)" class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">แก้ไข</button>
                <button @click="openDeleteModal(customer)" class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">ลบ</button>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-slate-500">ไม่มีข้อมูลลูกค้าในระบบ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal Overlay -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h3 class="font-bold text-lg text-slate-800">{{ modalMode === 'add' ? 'เพิ่มข้อมูลลูกค้าใหม่' : 'แก้ไขข้อมูลลูกค้า' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors"><X class="w-5 h-5"/></button>
        </div>
        
        <!-- Modal Body Form -->
        <form @submit.prevent="saveCustomer" class="flex flex-col flex-1 overflow-hidden">
          <div class="p-6 overflow-y-auto space-y-6 flex-1">
            
            <!-- Section 1: Personal Info -->
            <div class="space-y-4">
              <h4 class="font-bold text-sm text-primary-700 uppercase tracking-wider border-b border-slate-100 pb-2">ข้อมูลส่วนตัวและสถานที่พัก</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">ชื่อ - นามสกุล <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น สมชาย รักดี">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">เลขประจำตัวประชาชน <span class="text-red-500">*</span></label>
                  <input v-model="form.idCard" type="text" required pattern="\d{13}" title="กรุณากรอกตัวเลข 13 หลัก" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เลข 13 หลัก">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">ห้องที่พัก <span class="text-slate-400 font-normal text-xs ml-1">(ระบุอัตโนมัติ)</span></label>
                  <input v-model="form.room" type="text" disabled class="w-full border border-slate-300 bg-slate-100/70 text-slate-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed outline-none" placeholder="รอผูกสัญญาเช่าที่เมนูห้องพัก">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
                  <input v-model="form.phone" type="tel" required class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น 081-xxx-xxxx">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">สถานะ</label>
                  <select v-model="form.status" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                    <option value="Active">ผู้เช่าปัจจุบัน</option>
                    <option value="Inactive">ย้ายออก</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">จำนวนผู้อยู่อาศัยร่วม (คน)</label>
                  <input v-model="form.coResidents" type="number" min="1" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="1">
                </div>
              </div>
            </div>

            <!-- Section 2: Additional Info -->
            <div class="space-y-4 pt-2">
              <h4 class="font-bold text-sm text-primary-700 uppercase tracking-wider border-b border-slate-100 pb-2">ข้อมูลเพิ่มเติม (สำหรับนิติบุคคล)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">ทะเบียนรถ (ยนต์/จักรยานยนต์)</label>
                  <input v-model="form.vehicleReg" type="text" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น กข 1234 กทม.">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">สถานะที่จอดรถ</label>
                  <select v-model="form.parkingZone" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                    <option value="">ไม่เช่าที่จอด</option>
                    <option v-for="zone in parkingZones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">อาชีพ / สถานที่ทำงาน</label>
                  <input v-model="form.occupation" type="text" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น พนักงานบริษัท C">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">ชื่อผู้ติดต่อฉุกเฉิน</label>
                  <input v-model="form.emergencyContact" type="text" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="ชื่อญาติ/เพื่อนสนิท">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">เบอร์ฉุกเฉิน</label>
                  <input v-model="form.emergencyPhone" type="tel" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เบอร์โทรผู้ติดต่อฉุกเฉิน">
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 flex-shrink-0">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle class="w-8 h-8" />
          </div>
          <h3 class="font-bold text-xl text-slate-800 mb-2">ยืนยันการลบข้อมูล</h3>
          <p class="text-slate-500 text-sm">คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ <strong>{{ customerToDelete?.name }}</strong> ? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        </div>
        <div class="px-6 py-4 bg-slate-50 flex justify-center space-x-3 gap-2">
          <button @click="isDeleteModalOpen = false" class="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">ยืนยันลบ</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, X, AlertTriangle, Search, Filter } from 'lucide-vue-next'
import { settingsStore } from '../store/settingsStore'
import { dataStore } from '../store/dataStore'

const customers = computed(() => dataStore.customers)

const searchQuery = ref('')
const filterStatus = ref('all')

const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(c => {
    const matchStatus = filterStatus.value === 'all' || c.status === filterStatus.value
    const matchSearch = !query || 
      String(c.name).toLowerCase().includes(query) ||
      (c.room && String(c.room).toLowerCase().includes(query)) ||
      (c.idCard && String(c.idCard).toLowerCase().includes(query)) ||
      (c.vehicleReg && String(c.vehicleReg).toLowerCase().includes(query)) ||
      (c.phone && String(c.phone).toLowerCase().includes(query))

    return matchStatus && matchSearch
  })
})

// --- Form & Create/Edit Modal Logic ---
const isModalOpen = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const editingId = ref(null)

const form = reactive({
  name: '',
  idCard: '',
  room: '',
  phone: '',
  status: 'Active',
  vehicleReg: '',
  emergencyContact: '',
  emergencyPhone: '',
  occupation: '',
  coResidents: 1,
  parkingZone: 1,
})

const parkingZones = computed(() => settingsStore.parkingZones)

const openModal = (mode, customer = null) => {
  modalMode.value = mode
  if (mode === 'edit' && customer) {
    editingId.value = customer.id
    form.name = customer.name
    form.idCard = customer.idCard || ''
    form.room = customer.room
    form.phone = customer.phone
    form.status = customer.status
    form.vehicleReg = customer.vehicleReg || ''
    form.emergencyContact = customer.emergencyContact || ''
    form.emergencyPhone = customer.emergencyPhone || ''
    form.occupation = customer.occupation || ''
    form.coResidents = customer.coResidents || 1
    form.parkingZone = customer.parkingZone || ''
  } else {
    // Reset form for 'add'
    editingId.value = null
    form.name = ''
    form.idCard = ''
    form.room = ''
    form.phone = ''
    form.status = 'Active'
    form.vehicleReg = ''
    form.emergencyContact = ''
    form.emergencyPhone = ''
    form.occupation = ''
    form.coResidents = 1
    form.parkingZone = ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCustomer = () => {
  if (modalMode.value === 'add') {
    // Gen ID roughly
    const newId = dataStore.customers.length ? Math.max(...dataStore.customers.map(c => c.id)) + 1 : 1
    dataStore.customers.unshift({ id: newId, ...form })
  } else if (modalMode.value === 'edit') {
    const index = dataStore.customers.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      dataStore.customers[index] = { id: editingId.value, ...form }
    }
  }
  closeModal()
}

// --- Delete Modal Logic ---
const isDeleteModalOpen = ref(false)
const customerToDelete = ref(null)

const openDeleteModal = (customer) => {
  customerToDelete.value = customer
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (customerToDelete.value) {
    dataStore.customers = dataStore.customers.filter(c => c.id !== customerToDelete.value.id)
  }
  isDeleteModalOpen.value = false
  customerToDelete.value = null
}
</script>
