<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center space-x-4 mb-6">
      <router-link to="/buildings" class="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <div>
        <h2 class="text-2xl font-bold text-slate-800">ข้อมูลเช่า ห้อง {{ roomNumber }}</h2>
        <p class="text-sm text-slate-500 mt-1">รายละเอียดสัญญาและประวัติการชำระเงิน</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Rental Info Card -->
      <div class="lg:col-span-1 space-y-6">
        <div v-if="rentalData.status === 'Occupied'" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center">
            <UserCheck class="w-5 h-5 mr-2 text-primary-600" />
            ข้อมูลผู้เช่า
          </h3>
          <div class="space-y-4 flex-grow">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ชื่อผู้เช่า</p>
              <p class="font-medium text-slate-800">{{ rentalData.tenantName || 'ไม่มีข้อมูล' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">วันที่เริ่มเช่า</p>
              <p class="font-medium text-slate-800">{{ rentalData.startDate || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">วันสิ้นสุดเช่า</p>
              <p class="font-medium text-slate-800">{{ rentalData.endDate || 'ไม่ระบุ' }}</p>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1 border-b border-slate-100 pb-1">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">สัญญาเช่า (อ้างอิง)</p>
                <button @click="triggerContractUpload" class="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center bg-primary-50 hover:bg-primary-100 transition-colors px-2 py-1 rounded">
                  <UploadCloud class="w-3 h-3 mr-1" /> อัปโหลด
                </button>
              </div>
              <div v-if="latestContract" class="flex items-center justify-between mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div class="flex items-center space-x-2 overflow-hidden">
                  <FileText class="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <a :href="latestContract.url" target="_blank" class="text-sm font-medium text-blue-600 hover:underline truncate max-w-[140px]" :title="latestContract.name">{{ latestContract.name }}</a>
                </div>
                <button v-if="roomContracts.length > 1" @click="showContractHistory" class="text-[10px] text-slate-500 hover:text-primary-600 underline font-medium flex-shrink-0 ml-2">ดูทั้งหมด ({{ roomContracts.length }})</button>
              </div>
              <div v-else class="text-sm text-slate-400 italic mt-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-center">
                ยังไม่มีการอัปโหลดสัญญา
              </div>
              
              <!-- Hidden input for contract upload -->
              <input type="file" ref="contractFileInput" class="hidden" accept=".pdf,image/*" @change="handleContractUpload" />
            </div>
          </div>

          <!-- Danger Zone: Move Out Button -->
          <div class="mt-8 pt-5 border-t border-red-100">
             <button @click="isMoveOutModalOpen = true" class="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white py-2.5 rounded-lg font-bold transition-all shadow-sm group">
               <LogOut class="w-4 h-4 group-hover:animate-pulse" />
               <span>แจ้งย้ายออก (Move Out)</span>
             </button>
             <p class="text-[11px] text-center text-red-500/80 mt-2.5 font-semibold flex items-center justify-center">
               <AlertTriangle class="w-3 h-3 mr-1" /> สิ้นสุดสัญญาเช่าห้อง
             </p>
          </div>
        </div>

        <div v-else-if="rentalData.status === 'Maintenance'" class="bg-white rounded-xl shadow-sm border border-amber-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
          <div class="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
            <Wrench class="w-12 h-12" />
          </div>
          <h3 class="text-3xl font-black text-slate-800 mb-3">ไม่พร้อมเข้าอยู่</h3>
          <p class="text-slate-500 mb-8 text-sm px-4 leading-relaxed">ห้องนี้กำลังอยู่ระหว่างการซ่อมบำรุง ตรวจสอบ หรือทำความสะอาด ยังไม่พร้อมเปิดให้เช่าสำหรับผู้เช่าใหม่</p>
          <button class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-lg shadow-sm flex items-center justify-center transition-colors text-base group cursor-default">
            <Settings class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
            ปรับปรุงห้อง
          </button>
        </div>

        <div v-else-if="rentalData.status === 'Reserved'" class="bg-white rounded-xl shadow-sm border border-blue-200 p-6 flex flex-col h-full">
          <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center">
            <UserCheck class="w-5 h-5 mr-2 text-blue-600" />
            ข้อมูลการจอง
          </h3>
          <div class="space-y-4 flex-grow">
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ชื่อผู้จอง</p>
              <p class="font-medium text-slate-800">{{ rentalData.tenantName || 'ไม่มีข้อมูล' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">วันที่ทำรายการ</p>
              <p class="font-medium text-slate-800">{{ new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) }}</p>
            </div>
            <div>
              <p class="text-sm italic text-blue-600 mt-4">ห้องนี้ถูกจองไว้แล้ว และรอผู้เช่ายืนยันการย้ายเข้า</p>
            </div>
          </div>

          <div class="mt-8 pt-5 border-t border-blue-100 flex flex-col space-y-3">
             <button @click="startMoveIn" class="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white hover:bg-emerald-700 py-3 rounded-lg font-bold transition-all shadow-sm group">
               <Check class="w-5 h-5 mr-1" />
               <span>ยืนยันย้ายเข้า</span>
             </button>
             <div>
               <button @click="isMoveOutModalOpen = true" class="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white py-2.5 rounded-lg font-bold transition-all shadow-sm group mt-2">
                 <LogOut class="w-4 h-4 group-hover:animate-pulse" />
                 <span>ยกเลิกการจอง</span>
               </button>
               <p class="text-[11px] text-center text-red-500/80 mt-2.5 font-semibold flex items-center justify-center">
                 <AlertTriangle class="w-3 h-3 mr-1" /> ลบข้อมูลการจองและเปลี่ยนห้องเป็นว่าง
               </p>
             </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-emerald-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
          <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
            <CheckCircle class="w-12 h-12" />
          </div>
          <h3 class="text-3xl font-black text-slate-800 mb-3">ห้องว่าง</h3>
          <p class="text-slate-500 mb-8 text-sm px-4 leading-relaxed">ห้องพร้อมเปิดให้เช่า สามารถนำผู้เช่าใหม่เข้าสู่ระบบและผูกสัญญาเช่าได้ทันที</p>
          <button @click="isAssignTenantModalOpen = true" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-sm flex items-center justify-center transition-colors text-base">
            <Plus class="w-5 h-5 mr-2" />
            เพิ่มผู้เช่าใหม่
          </button>
        </div>
      </div>

      <!-- Bill History -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-800 flex items-center">
              <History class="w-5 h-5 mr-2 text-primary-600" />
              ประวัติชำระเงินบิล
            </h3>
            <button @click="showAllBills = !showAllBills" class="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline transition-colors px-2 py-1 rounded">
              {{ showAllBills ? 'ย่อลง' : 'ดูทั้งหมด' }}
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="bg-slate-50/50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th class="px-6 py-3">รอบเดือน</th>
                  <th class="px-6 py-3">รหัสบิล</th>
                  <th class="px-6 py-3 text-right">ยอดชำระ</th>
                  <th class="px-6 py-3 text-center">สถานะ</th>
                  <th class="px-6 py-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="bill in displayedBills" :key="bill.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">{{ bill.month }}</td>
                  <td class="px-6 py-4 text-primary-600">{{ bill.code }}</td>
                  <td class="px-6 py-4 text-right font-mono font-medium text-slate-800">฿{{ bill.total.toLocaleString() }}</td>
                  <td class="px-6 py-4 text-center">
                    <span :class="[
                      'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm',
                      bill.status === 'Paid' ? 'bg-paid-100 text-paid' : bill.status === 'Pending' ? 'bg-pending-100 text-pending' : 'bg-cancelled-100 text-cancelled'
                    ]">
                      {{ bill.status === 'Paid' ? 'ชำระแล้ว' : bill.status === 'Pending' ? 'รอตรวจสอบ' : 'ค้างชำระ' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                    <button @click="openVerifyModal(bill)" class="text-blue-600 hover:text-blue-700 font-bold text-xs transition-colors px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200">ตรวจสอบ</button>
                  </td>
                </tr>
                <tr v-if="allBills.length === 0">
                  <td colspan="5" class="px-6 py-8 text-center text-slate-500">ไม่มีประวัติบิล</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Assign Tenant -->
    <div v-if="isAssignTenantModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800 flex items-center"><UserCheck class="w-5 h-5 mr-2 text-primary-600"/> ผูกผู้เช่าเข้าห้อง {{ roomNumber }}</h3>
          <button @click="closeAssignModal" class="text-slate-400 hover:text-slate-600"><X class="w-5 h-5"/></button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-semibold text-slate-700 mb-2">เลือกผู้เช่าจากรายชื่อลูกค้าทั้งหมด</label>
          <select v-model="selectedCustomerToAssign" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="" disabled>-- เลือกผู้เช่า --</option>
            <option v-for="c in availableToAssignCustomers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.phone }})
            </option>
          </select>
          <label class="block text-sm font-semibold text-slate-700 mb-2 mt-4">สถานะการเข้าพัก</label>
          <div class="flex space-x-4 mb-2">
            <label class="flex items-center space-x-2 cursor-pointer p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex-1">
              <input type="radio" v-model="selectedAssignStatus" value="Occupied" class="text-primary-600 focus:ring-primary-500 w-4 h-4">
              <span class="text-sm font-medium text-slate-700">มีผู้เช่า (เข้าอยู่ทันที)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex-1">
              <input type="radio" v-model="selectedAssignStatus" value="Reserved" class="text-primary-600 focus:ring-primary-500 w-4 h-4">
              <span class="text-sm font-medium text-slate-700">ติดจอง</span>
            </label>
          </div>

          <p v-if="availableToAssignCustomers.length === 0" class="text-xs text-red-500 mt-3 flex items-center">
            <AlertTriangle class="w-3 h-3 mr-1" /> ไม่มีรายชื่อผู้เช่าที่ว่างอยู่ (กรุณาไปเพิ่มที่หน้า Customers ก่อน)
          </p>
          <p v-else class="text-xs text-slate-500 mt-3 flex items-center"><CheckCircle class="w-3 h-3 mr-1 text-green-500" /> แสดงเฉพาะรายชื่อที่ยังไม่มีห้องพัก</p>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button @click="closeAssignModal" class="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button :disabled="!selectedCustomerToAssign" @click="handleAssignTenant" class="px-4 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Check class="w-4 h-4 mr-1.5" /> ยืนยันย้ายเข้า
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Move Out -->
    <div v-if="isMoveOutModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-2 border-red-500">
        <div class="p-6 text-center">
          <div class="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
            <AlertTriangle class="w-10 h-10" />
          </div>
          <h3 class="font-bold text-2xl text-slate-800 mb-2">ยืนยันแจ้งย้ายออก !</h3>
          <p class="text-slate-500 text-sm mb-6">
            คุณกำลังทำเรื่องย้ายออกให้ห้อง <span class="font-bold text-slate-800">{{ roomNumber }}</span><br/>
            การกระทำนี้จะเปลี่ยนสถานะห้องเป็น <span class="text-emerald-600 font-bold">"ว่าง"</span> และลบข้อมูลผู้เช่าปัจจุบัน!
          </p>
          
          <div class="bg-red-50 rounded-lg p-4 mb-2 border border-red-100 text-left">
            <label class="block text-xs font-bold text-red-800 uppercase mb-2">พิมพ์คำว่า "ยืนยัน" เพื่อดำเนินการต่อ</label>
            <input v-model="moveOutConfirmText" type="text" class="w-full border-2 border-red-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder-red-300 text-red-900 font-bold" placeholder="พิมพ์ข้อความที่นี่...">
          </div>
        </div>
        
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center space-x-3 gap-2">
          <button @click="closeMoveOutModal" class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button :disabled="moveOutConfirmText !== 'ยืนยัน'" @click="handleMoveOut" class="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center">
            <LogOut class="w-4 h-4 mr-2" /> ย้ายออกทันที
          </button>
        </div>
      </div>
    </div>
    <!-- Bill Detail Modal -->
    <BillDetailModal
      :is-open="isVerifyModalOpen"
      :bill="selectedBill"
      @close="closeVerifyModal"
    />

    <!-- Message Modal -->
    <div v-if="isMessageModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800 flex items-center"><Send class="w-5 h-5 mr-2 text-emerald-600"/> ส่งข้อความถึงผู้เช่า</h3>
          <button @click="closeMessageModal" class="text-slate-400 hover:text-slate-600"><X class="w-5 h-5"/></button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-semibold text-slate-700 mb-2">ข้อความแจ้งเตือนบิล</label>
          <textarea v-model="messageText" rows="5" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none leading-relaxed"></textarea>
          <p class="text-xs text-slate-500 mt-3 flex items-center"><CheckCircle class="w-3 h-3 mr-1 text-green-500" /> แจ้งเตือนจะถูกส่งผ่าน Line Official ทันที</p>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button @click="closeMessageModal" class="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button @click="sendBillMessage" class="px-4 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center transition-colors shadow-sm">
            <Send class="w-4 h-4 mr-1.5" /> ยืนยันการส่งข้อความ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, UserCheck, FileText, History, Users, LogOut, AlertTriangle, CheckCircle, Plus, Wrench, Settings, X, FileCheck, Check, Send, UploadCloud } from 'lucide-vue-next'
import BillDetailModal from '../components/BillDetailModal.vue'
import { dataStore } from '../store/dataStore'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const roomNumber = ref('')
const showAllBills = ref(false)

// --- Contract Upload & History ---
const roomContracts = ref([])
const latestContract = computed(() => {
  return roomContracts.value.length > 0 ? roomContracts.value[roomContracts.value.length - 1] : null
})
const contractFileInput = ref(null)

const triggerContractUpload = () => {
  if (contractFileInput.value) contractFileInput.value.click()
}

const handleContractUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const fileUrl = URL.createObjectURL(file)
    const newContract = {
      id: Date.now(),
      name: file.name,
      url: fileUrl,
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
    }
    
    roomContracts.value.push(newContract)

    // Save to global state so it persists if navigating back
    for (const b of dataStore.buildings) {
      for (const f of b.floors) {
        const room = f.rooms.find(r => r.number === roomNumber.value)
        if (room) {
          if (!room.contracts) room.contracts = []
          room.contracts.push(newContract)
        }
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'อัปโหลดสำเร็จ',
      text: `บันทึกสัญญา ${file.name} เข้าสู่ระบบเรียบร้อยแล้ว`,
      timer: 1500,
      showConfirmButton: false
    })

    // Reset input
    event.target.value = ''
  }
}

const showContractHistory = () => {
  const historyHtml = roomContracts.value.slice().reverse().map((c, i) => `
    <div class="flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left last:border-0 rounded">
      <div class="flex items-center space-x-3 overflow-hidden">
        <span class="bg-primary-100 text-primary-700 px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap">ฉบับที่ ${roomContracts.value.length - i}</span>
        <a href="${c.url}" target="_blank" class="text-blue-600 hover:underline font-medium text-sm truncate max-w-[160px] block">${c.name}</a>
      </div>
      <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">${c.date}</span>
    </div>
  `).join('')

  Swal.fire({
    title: 'ประวัติเอกสารสัญญาเช่า',
    html: `<div class="mt-4 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-inner">${historyHtml}</div>`,
    confirmButtonText: 'ปิดหน้าต่าง',
    width: '500px',
    customClass: {
      popup: 'rounded-xl',
      title: 'text-xl font-bold text-slate-800'
    }
  })
}

const isMoveOutModalOpen = ref(false)
const moveOutConfirmText = ref('')

const closeMoveOutModal = () => {
  isMoveOutModalOpen.value = false
  moveOutConfirmText.value = ''
}

const handleMoveOut = () => {
  if (moveOutConfirmText.value === 'ยืนยัน') {
    // update store recursively to mark as vacant
    for (const b of dataStore.buildings) {
      for (const f of b.floors) {
        const room = f.rooms.find(r => r.number === roomNumber.value)
        if (room) {
          room.status = 'Vacant'
          room.tenant = null
        }
      }
    }
    
    // clear tenant's room status in customers
    const customer = dataStore.customers.find(c => c.room === roomNumber.value)
    if (customer) {
      customer.room = ''
    }

    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: 'บันทึกการย้ายออกเรียบร้อยแล้ว สถานะห้องเปลี่ยนเป็น "ว่าง"',
      confirmButtonText: 'ตกลง'
    }).then(() => {
      closeMoveOutModal()
      router.push('/buildings')
    })
  }
}

// --- Tenant Assignment ---
const isAssignTenantModalOpen = ref(false)
const selectedCustomerToAssign = ref('')
const selectedAssignStatus = ref('Occupied')

const availableToAssignCustomers = computed(() => {
  return dataStore.customers.filter(c => !c.room || c.room === '')
})

const closeAssignModal = () => {
  isAssignTenantModalOpen.value = false
  selectedCustomerToAssign.value = ''
  selectedAssignStatus.value = 'Occupied'
}

const handleAssignTenant = () => {
  if (!selectedCustomerToAssign.value) return
  
  const customer = dataStore.customers.find(c => c.id === selectedCustomerToAssign.value)
  if (!customer) return

  let found = false
  for (const b of dataStore.buildings) {
    for (const f of b.floors) {
      const room = f.rooms.find(r => r.number === roomNumber.value)
      if (room) {
        room.status = selectedAssignStatus.value
        room.tenant = customer.name
        found = true
        break
      }
    }
    if (found) break
  }

  customer.room = roomNumber.value
  
  rentalData.value = {
    status: selectedAssignStatus.value,
    tenantName: customer.name,
    startDate: selectedAssignStatus.value === 'Occupied' ? new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' }) : null,
    endDate: null,
    contractId: `CT-${new Date().getFullYear()}-${roomNumber.value}`
  }

  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: `เพิ่มผู้เช่า ${customer.name} เข้าห้อง ${roomNumber.value} สำเร็จ`,
    confirmButtonText: 'ตกลง'
  }).then(() => {
    closeAssignModal()
  })
}

const startMoveIn = () => {
  Swal.fire({
    title: 'ยืนยันการเข้าพัก',
    text: `ต้องการเปลี่ยนสถานะห้อง ${roomNumber.value} เป็น "มีผู้เช่า" ใช่หรือไม่?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'ยืนยันเข้าอยู่',
    cancelButtonText: 'ยกเลิก',
    customClass: {
      confirmButton: 'px-4 py-2 font-bold text-white rounded-lg',
      cancelButton: 'px-4 py-2 font-medium text-white rounded-lg'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      let found = false
      for (const b of dataStore.buildings) {
        for (const f of b.floors) {
          const room = f.rooms.find(r => r.number === roomNumber.value)
          if (room) {
            room.status = 'Occupied'
            found = true
            break
          }
        }
        if (found) break
      }

      rentalData.value.status = 'Occupied'
      rentalData.value.startDate = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })
      rentalData.value.contractId = `CT-${new Date().getFullYear()}-${roomNumber.value}`

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: `อัปเดตสถานะห้องเป็น "มีผู้เช่า" สำเร็จ`,
        confirmButtonText: 'ตกลง'
      })
    }
  })
}

// --- Bills Action Modals ---
const isVerifyModalOpen = ref(false)
const selectedBill = ref(null)

const openVerifyModal = (bill) => {
  selectedBill.value = bill
  isVerifyModalOpen.value = true
}
const closeVerifyModal = () => {
  isVerifyModalOpen.value = false
}

const isMessageModalOpen = ref(false)
const messageText = ref('')

const openMessageModal = (bill) => {
  selectedBill.value = bill
  messageText.value = `ห้อง ${roomNumber.value} - วันนี้เป็นวันกำหนดชำระบิล ${bill.code} ประจำรอบเดือน ${bill.month} ยอดชำระรวม ฿${bill.total.toLocaleString()} \n\nสามารถชำระเงินโดยการโอนผ่านบัญชีของอพาร์ทเม้นท์ และแนบสลิปเพื่อยืนยันผ่านระบบได้เลยครับ 🏢`
  isMessageModalOpen.value = true
}
const closeMessageModal = () => {
  isMessageModalOpen.value = false
}

const sendBillMessage = () => {
  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: 'ระบบได้ส่งข้อความถึงผู้เช่าผ่านทางระบบข้อความหลักและ LINE สำเร็จแล้ว',
    confirmButtonText: 'ตกลง'
  }).then(() => {
    closeMessageModal()
  })
}

// Mock Data
const rentalData = ref({
  status: 'Occupied',
  tenantName: 'สมชาย รักดี',
  startDate: '01 มกราคม 2023',
  endDate: null,
  contractId: 'CT-2023-001'
})

const allBills = computed(() => {
  if (rentalData.value.status !== 'Occupied') return []
  return dataStore.bills.filter(b => b.room === roomNumber.value)
})

const displayedBills = computed(() => {
  return showAllBills.value ? allBills.value : allBills.value.slice(0, 4)
})

const tenantHistory = ref([
  {
    id: 1,
    name: 'สมชาย รักดี',
    phone: '081-234-5678',
    lineId: 'somchai.ruk',
    address: '123/4 หมู่ 5 ต.ช้างเผือก อ.เมือง จ.เชียงใหม่ 50300',
    startDate: '01 มกราคม 2023',
    endDate: null
  },
  {
    id: 2,
    name: 'สมหญิง งามตา',
    phone: '089-876-5432',
    lineId: 'ying_ngam',
    address: '45/6 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110',
    startDate: '15 กุมภาพันธ์ 2022',
    endDate: '31 ธันวาคม 2022'
  }
])

onMounted(() => {
  const id = route.params.id
  roomNumber.value = id
  
  let foundRoom = null
  for (const b of dataStore.buildings) {
    for (const f of b.floors) {
      const rm = f.rooms.find(r => r.number === id)
      if (rm) {
        foundRoom = rm
        break
      }
    }
  }

  if (foundRoom) {
    // Load existing contracts or mock a default one if occupied
    let contractsList = foundRoom.contracts || []
    if (contractsList.length === 0 && foundRoom.status === 'Occupied') {
      contractsList = [{
        id: 1,
        name: `สัญญาเช่า_${id}.pdf`,
        url: '#',
        date: '01 ม.ค. 2023'
      }]
      foundRoom.contracts = contractsList
    }
    roomContracts.value = contractsList

    rentalData.value = {
      status: foundRoom.status,
      tenantName: foundRoom.tenant,
      startDate: foundRoom.status === 'Occupied' ? '01 มกราคม 2023' : null,
      endDate: null,
      contractId: foundRoom.status === 'Occupied' ? `CT-2023-${id}` : null
    }
  } else {
    roomContracts.value = []
    rentalData.value = { status: 'Vacant', tenantName: null, startDate: null, endDate: null, contractId: null }
  }
})
</script>
