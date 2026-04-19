<template>
  <div class="max-w-3xl mx-auto pb-12">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-800">เปลี่ยนรหัสผ่าน</h2>
      <p class="text-sm text-slate-500 mt-1">ตั้งรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชีผู้ดูแลระบบ</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 sm:p-8">
        <form @submit.prevent="savePassword" class="space-y-6">
          
          <div class="space-y-5">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่านปัจจุบัน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="form.currentPassword" type="password" required class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="ป้อนรหัสผ่านปัจจุบัน">
              </div>
            </div>

            <div class="border-t border-slate-100 py-2"></div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่านใหม่</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="form.newPassword" type="password" required class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร">
              </div>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck class="h-5 w-5 text-slate-400" />
                </div>
                <input v-model="form.confirmPassword" type="password" required class="w-full pl-10 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="ป้อนรหัสผ่านใหม่อีกครั้ง">
              </div>
              <p v-if="passwordMismatch" class="text-sm text-red-500 mt-2 flex items-center font-medium">
                <AlertCircle class="w-4 h-4 mr-1" /> รหัสผ่านใหม่ไม่ตรงกัน
              </p>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" :disabled="passwordMismatch || !isFormValid" class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm flex items-center transition-colors">
              <Save class="w-5 h-5 mr-2" />
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Key, Lock, ShieldCheck, Save, AlertCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return form.value.newPassword !== '' && form.value.confirmPassword !== '' && form.value.newPassword !== form.value.confirmPassword
})

const isFormValid = computed(() => {
  return form.value.currentPassword.length > 0 && form.value.newPassword.length >= 6 && form.value.confirmPassword.length >= 6
})

const savePassword = () => {
  if (passwordMismatch.value || !isFormValid.value) return
  
  // In a real app, verify current password and issue API call here.
  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ในการเข้าสู่ระบบครั้งหน้าโปรดใช้รหัสผ่านใหม่',
    confirmButtonText: 'ตกลง'
  })
  
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}
</script>
