<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">เทมเพลตข้อความบรอดแคสต์</h2>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <form @submit.prevent="sendMessage">
        
        <!-- Broadcast Type -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-slate-700 mb-4">ประเภทบรอดแคสต์</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none transition-all"
                   :class="broadcastType === 'sms' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'">
              <input type="radio" name="broadcast_type" value="sms" v-model="broadcastType" class="sr-only">
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <span class="block text-sm font-bold text-slate-900">ค่าน้ำ</span>
                  <span class="mt-1 flex items-center text-xs text-slate-500">แจ้งเตือนให้ส่งเลขมิเตอร์</span>
                </span>
              </span>
              <Droplets class="h-5 w-5 text-primary-600" v-if="broadcastType === 'sms'" />
            </label>

            <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none transition-all"
                   :class="broadcastType === 'line' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'">
              <input type="radio" name="broadcast_type" value="line" v-model="broadcastType" class="sr-only">
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <span class="block text-sm font-bold text-slate-900">ค่าไฟ</span>
                  <span class="mt-1 flex items-center text-xs text-slate-500">แจ้งเตือนให้ส่งเลขมิเตอร์</span>
                </span>
              </span>
              <Zap class="h-5 w-5 text-primary-500" v-if="broadcastType === 'line'" />
            </label>

            <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none transition-all"
                   :class="broadcastType === 'email' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'">
              <input type="radio" name="broadcast_type" value="email" v-model="broadcastType" class="sr-only">
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <span class="block text-sm font-bold text-slate-900">ชำระบิล</span>
                  <span class="mt-1 flex items-center text-xs text-slate-500">แจ้งเตือนให้ส่งหลักฐานการชำระเงิน</span>
                </span>
              </span>
              <Receipt class="h-5 w-5 text-primary-500" v-if="broadcastType === 'email'" />
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div class="mb-4 sm:mb-0">
            <label class="block text-sm font-bold text-slate-800">สถานะการทำงาน</label>
            <p class="text-xs text-slate-500 mt-1">เปิดใช้งานการส่งข้อความอัตโนมัติสำหรับช่องทางนี้</p>
          </div>
          <div class="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span class="text-sm font-bold uppercase tracking-wide" :class="broadcastSettings[broadcastType] ? 'text-green-600' : 'text-slate-400'">
              {{ broadcastSettings[broadcastType] ? 'Active' : 'Inactive' }}
            </span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="broadcastSettings[broadcastType]" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <!-- Target Audience -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-slate-700 mb-2">กลุ่มเป้าหมาย</label>
          <select class="mt-1 block w-full rounded-md border-slate-300 py-3 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border">
            <option>ผู้เช่าทั้งหมด</option>
            <option>เฉพาะคนที่ค้างชำระบิล</option>
            <option>เฉพาะอาคาร A</option>
            <option>เฉพาะอาคาร B</option>
          </select>
        </div>

        <!-- Schedule -->
        <div class="mb-6">
          <label class="flex items-center text-sm font-semibold text-slate-700 mb-2">
            <Calendar class="w-4 h-4 mr-2 text-indigo-500" />
            กำหนดเวลาบรอดแคสต์
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">วันที่ของเดือน (1-31)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar class="h-4 w-4 text-slate-400" />
                </div>
                <input type="number" min="1" max="31" v-model="scheduleDay" class="block w-full rounded-md border-slate-300 py-3 pl-9 pr-3 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border" placeholder="เช่น 25">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">เวลาที่จะบรอดแคสต์ (น.)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock class="h-4 w-4 text-slate-400" />
                </div>
                <input type="time" v-model="scheduleTime" class="block w-full rounded-md border-slate-300 py-3 pl-9 pr-3 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border">
              </div>
            </div>
          </div>
        </div>

        <!-- Message Template -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-slate-700 mb-2">ข้อความ (Template)</label>
          <p class="text-xs text-slate-500 mb-3">คุณสามารถใช้ตัวแปร {name}, {room}, {amount} ในข้อความได้</p>
          <textarea
            v-model="messageBody"
            rows="6"
            class="block w-full rounded-md border-slate-300 border shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-4"
            placeholder="เรียนคุณ {name} ห้อง {room}..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button type="button" class="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3">
            ยกเลิก
          </button>
          <button type="submit" class="bg-primary-600 border border-transparent rounded-md shadow-sm py-2 px-6 flex items-center justify-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 space-x-2">
            <Send class="w-4 h-4" />
            <span>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Droplets, Zap, Receipt, Send, Calendar, Clock } from 'lucide-vue-next'
import { dataStore } from '../store/dataStore'
import Swal from 'sweetalert2'

const broadcastSettings = computed(() => dataStore.broadcast.settings)
const broadcastType = computed({
  get: () => dataStore.broadcast.broadcastType,
  set: (val) => dataStore.broadcast.broadcastType = val
})
const scheduleDay = computed({
  get: () => dataStore.broadcast.scheduleDay,
  set: (val) => dataStore.broadcast.scheduleDay = val
})
const scheduleTime = computed({
  get: () => dataStore.broadcast.scheduleTime,
  set: (val) => dataStore.broadcast.scheduleTime = val
})
const messageBody = computed({
  get: () => dataStore.broadcast.messageBody,
  set: (val) => dataStore.broadcast.messageBody = val
})

const sendMessage = () => {
  if (scheduleDay.value && scheduleTime.value) {
    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: `ตั้งเวลาส่งข้อความผ่าน ${broadcastType.value} ทุกวันที่ ${scheduleDay.value} เวลา ${scheduleTime.value} น. เรียบร้อยแล้ว`,
      confirmButtonText: 'ตกลง'
    })
  } else {
    Swal.fire({
      icon: 'info',
      title: 'กำลังส่ง...',
      text: `กำลังส่งข้อความผ่าน ${broadcastType.value} ไปยังผู้เช่า...`,
      confirmButtonText: 'ตกลง'
    })
  }
}
</script>
