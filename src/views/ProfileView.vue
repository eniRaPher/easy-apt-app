<template>
  <div class="max-w-4xl mx-auto pb-12">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-800">ตั้งค่าทั่วไป</h2>
      <p class="text-sm text-slate-500 mt-1">จัดการข้อมูลพื้นฐาน ช่องทางการติดต่อ และอัตราค่าบริการของโครงการ</p>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-6">
      
      <!-- Setting Group 1: General Info -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 sm:p-8">
          <h3 class="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center">
            <Building class="w-5 h-5 mr-2 text-primary-600" />
            ข้อมูลพื้นฐานของโครงการ
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Project Name -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-2">ชื่อโครงการ / อพาร์ทเม้นท์</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="profileData.projectName" type="text" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น Easy Apt ลาดพร้าว">
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">เบอร์โทรศัพท์ติดต่อ</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="profileData.phone" type="tel" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="08x-xxx-xxxx">
              </div>
            </div>

            <!-- Line ID -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">LINE ID</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageCircle class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="profileData.lineId" type="text" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="@easyapt">
              </div>
            </div>

            <!-- Facebook -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-2">ลิงก์ Facebook Page</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Facebook class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="profileData.facebook" type="url" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="https://facebook.com/your-page">
              </div>
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-2">ที่อยู่โครงการ</label>
              <div class="relative">
                <div class="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <MapPin class="h-5 w-5 text-slate-400" />
                </div>
                <textarea v-model="profileData.address" rows="3" class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none" placeholder="ระบุที่อยู่โครงการ..."></textarea>
              </div>
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
import { Building, Phone, MessageCircle, Facebook, MapPin, Save } from 'lucide-vue-next'
import { settingsStore } from '../store/settingsStore'
import Swal from 'sweetalert2'

const profileData = settingsStore

const saveProfile = () => {
  // In a real app, you would save to Backend API here
  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: `บันทึกข้อมูลพื้นฐานเรียบร้อยแล้ว!\n\nชื่อ: ${profileData.projectName}\nติดต่อ: ${profileData.phone}`,
    confirmButtonText: 'ตกลง'
  })
}
</script>
