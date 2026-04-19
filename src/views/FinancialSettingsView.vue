<template>
  <div class="max-w-4xl mx-auto pb-12">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-800">ตั้งค่าการเงินสำหรับบิล</h2>
      <p class="text-sm text-slate-500 mt-1">จัดการอัตราค่าสาธารณูปโภค ค่าธรรมเนียมอเนกประสงค์ และเรทที่จอดรถต่างๆ ก่อนสร้างบิล</p>
    </div>

    <form @submit.prevent="saveFinancialSettings" class="space-y-6">
      
      <!-- Setting Group 1: Rates -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 sm:p-8">
          <h3 class="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center">
            <Zap class="w-5 h-5 mr-2 text-amber-500" />
            อัตราค่าสาธารณูปโภค (น้ำ/ไฟ)
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Electricity Rate -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">อัตราค่าไฟฟ้า (บาท/ยูนิต)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Zap class="h-5 w-5 text-amber-500" />
                </div>
                <input v-model="financialData.elecRate" type="number" step="0.5" min="0" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-mono" placeholder="เช่น 8">
              </div>
            </div>
            <!-- Water Rate -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">อัตราค่าน้ำประปา (บาท/ยูนิต)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Droplets class="h-5 w-5 text-blue-500" />
                </div>
                <input v-model="financialData.waterRate" type="number" step="0.5" min="0" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono" placeholder="เช่น 20">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Setting Group 2: Other Fees -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-800 flex items-center">
              <Building class="w-5 h-5 mr-2 text-primary-600" />
              ค่าธรรมเนียมอื่นๆ ที่เรียกเก็บต่อรอบบิล
            </h3>
            <button type="button" @click="addOtherFee" class="text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1.5 rounded-lg flex items-center transition-colors font-medium">
              <Plus class="w-4 h-4 mr-1" />
              เพิ่มค่าธรรมเนียม
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-if="financialData.otherFees.length === 0" class="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-lg border border-slate-100">
              ยังไม่มีข้อมูลค่าธรรมเนียมอื่นๆ ระบบจะไม่คิดค่าใช้จ่ายในส่วนนี้
            </div>
            
            <div v-for="(fee, index) in financialData.otherFees" :key="fee.id" class="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-primary-200 transition-colors">
              <div class="flex-1 w-full">
                <label class="block text-xs font-semibold text-slate-500 mb-1">ชื่อค่าธรรมเนียม</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users class="h-4 w-4 text-slate-400" />
                  </div>
                  <input v-model="fee.name" type="text" class="w-full pl-9 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น ค่าทำความสะอาด">
                </div>
              </div>
              <div class="w-full sm:w-48">
                <label class="block text-xs font-semibold text-slate-500 mb-1">จำนวนเงิน (บาท/หน่วย)</label>
                <input v-model="fee.amount" type="number" step="10" min="0" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-slate-700" placeholder="เช่น 300">
              </div>
              <button type="button" @click="removeOtherFee(fee.id)" class="text-slate-400 hover:text-red-500 p-2 sm:mb-0.5 rounded-lg hover:bg-red-50 transition-colors" title="ลบค่าธรรมเนียม">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Setting Group 3: Parking Zones -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-800 flex items-center">
              <Car class="w-5 h-5 mr-2 text-indigo-500" />
              ค่าที่จอดรถและประเภทยานพาหนะ (Zones)
            </h3>
            <button type="button" @click="addParkingZone" class="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center transition-colors font-medium">
              <Plus class="w-4 h-4 mr-1" />
              เพิ่มโซนที่จอดรถ
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-if="financialData.parkingZones.length === 0" class="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-lg border border-slate-100">
              ฟรีค่าที่จอดรถ (ไม่มีข้อมูลโซนที่ถูกเก็บค่าใช้จ่าย)
            </div>
            
            <div v-for="(zone, index) in financialData.parkingZones" :key="zone.id" class="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
              <div class="flex-1 w-full">
                <label class="block text-xs font-semibold text-slate-500 mb-1">ชื่อประเภท / โซน</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Car class="h-4 w-4 text-slate-400" />
                  </div>
                  <input v-model="zone.name" type="text" class="w-full pl-9 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="เช่น โซน VIP (ส่วนบุคคล) หรือ จักรยานยนต์">
                </div>
              </div>
              <div class="w-full sm:w-48">
                <label class="block text-xs font-semibold text-slate-500 mb-1">ค่าอัตรารายเดือน (บาท)</label>
                <input v-model="zone.rate" type="number" step="10" min="0" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono" placeholder="เช่น 1000">
              </div>
              <button type="button" @click="removeParkingZone(zone.id)" class="text-slate-400 hover:text-red-500 p-2 sm:mb-0.5 rounded-lg hover:bg-red-50 transition-colors" title="ลบโซน">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end pt-2">
        <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm flex items-center transition-colors">
          <Save class="w-5 h-5 mr-2" />
          บันทึก
        </button>
      </div>
          
    </form>
  </div>
</template>

<script setup>
import { Building, Save, Zap, Droplets, Car, Plus, Trash2, Users } from 'lucide-vue-next'
import { settingsStore } from '../store/settingsStore'
import Swal from 'sweetalert2'

const financialData = settingsStore

const addOtherFee = () => {
  const newId = financialData.otherFees.length ? Math.max(...financialData.otherFees.map(f => f.id)) + 1 : 1
  financialData.otherFees.push({ id: newId, name: '', amount: 0 })
}

const removeOtherFee = (id) => {
  const index = financialData.otherFees.findIndex(f => f.id === id)
  if(index !== -1) financialData.otherFees.splice(index, 1)
}

const addParkingZone = () => {
  const newId = financialData.parkingZones.length ? Math.max(...financialData.parkingZones.map(z => z.id)) + 1 : 1
  financialData.parkingZones.push({ id: newId, name: '', rate: 0 })
}

const removeParkingZone = (id) => {
  const index = financialData.parkingZones.findIndex(z => z.id === id)
  if(index !== -1) financialData.parkingZones.splice(index, 1)
}

const saveFinancialSettings = () => {
  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: `ระบบได้จดจำอัตราค่าใช้จ่ายใหม่ทั้งหมดแล้ว:\n- น้ำ/ไฟ: ${financialData.elecRate} / ${financialData.waterRate}\n- ค่าใช้จ่ายอื่นๆ: ${financialData.otherFees.length} รายการ\n- เรทที่จอดรถ: ${financialData.parkingZones.length} โซน\n(จะเริ่มมีผลกับบิลใหม่ทันที)`,
    confirmButtonText: 'ตกลง'
  })
}
</script>
