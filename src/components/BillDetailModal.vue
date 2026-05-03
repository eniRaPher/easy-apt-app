<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
        <h3 class="font-bold text-lg text-slate-800 flex items-center"><FileText class="w-5 h-5 mr-2 text-blue-600"/> รายละเอียดบิล</h3>
        <button @click="closeModal" class="text-slate-400 hover:text-slate-600"><X class="w-5 h-5"/></button>
      </div>
      <div class="p-6 overflow-y-auto flex-1">
        <div class="mb-4">
          <h4 class="font-bold text-primary-700 mb-1">บิล: {{ bill?.code }} {{ bill?.month ? `(${bill.month})` : '' }}</h4>
          <p class="text-sm text-slate-500">ยอดรวมทั้งสิ้น: <span class="font-bold text-slate-800 text-lg text-primary-600">฿{{ bill?.total?.toLocaleString() || '0' }}</span></p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
           <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span class="block text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">ค่าเช่าห้อง</span>
              <span class="font-semibold text-slate-800 border-b border-slate-200 pb-1 block">฿{{ bill?.rent?.toLocaleString() || '4,500' }}</span>
           </div>
           <div v-for="fee in (bill?.otherFees || [])" :key="fee.id" class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span class="block text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">{{ fee.name }}</span>
              <span class="font-semibold text-slate-800 border-b border-slate-200 pb-1 block">฿{{ fee.amount.toLocaleString() }}</span>
           </div>                          
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span class="block text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">ค่าจอดรถ</span>
              <span class="font-semibold text-slate-800 border-b border-slate-200 pb-1 block">฿{{ bill?.parkingFee?.toLocaleString() || '0' }}</span>
           </div>
           <div class="col-span-2 bg-amber-50/30 p-4 rounded-lg border border-amber-100">
              <div class="flex justify-between items-center mb-3">
                <span class="block text-slate-700 text-sm font-bold tracking-wide flex items-center">
                  <Zap class="w-4 h-4 mr-1.5 text-amber-500" /> ค่าไฟ 
                  <span class="text-xs font-normal text-slate-500 ml-2">({{ bill?.elecRate || 8 }} ฿/ยูนิต)</span>
                </span>
                <span class="font-bold text-lg text-amber-700">฿{{ ((Math.max(0, localBill.currElecMeter - localBill.prevElecMeter)) * (bill?.elecRate || 8)).toLocaleString() }}</span>
              </div>
              <div class="flex items-center space-x-3 text-sm">
                <div class="flex-1">
                  <label class="block text-[10px] text-slate-500 uppercase mb-1">มิเตอร์เดือนก่อน</label>
                  <div class="bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500 font-mono text-center cursor-not-allowed select-none">{{ localBill.prevElecMeter }}</div>
                </div>
                <div class="text-slate-300 mt-4">
                  <ArrowRight class="w-4 h-4" />
                </div>
                <div class="flex-1">
                  <label class="block text-[10px] text-amber-600 font-bold uppercase mb-1">มิเตอร์เดือนนี้</label>
                  <input v-if="bill" v-model.number="localBill.currElecMeter" @input="updateBillTotal" type="number" min="0" class="w-full border border-amber-300 rounded px-3 py-2 font-mono font-bold text-amber-700 bg-white focus:ring-2 focus:ring-amber-500 outline-none text-center shadow-inner">
                </div>
                <div class="text-slate-300 mt-4">
                  <Equal class="w-4 h-4" />
                </div>
                <div class="w-16 text-center">
                  <label class="block text-[10px] text-slate-500 uppercase mb-1">จำนวนใช้</label>
                  <div class="font-bold text-slate-700 mt-2 font-mono">{{ Math.max(0, localBill.currElecMeter - localBill.prevElecMeter) }}</div>
                </div>
              </div>
           </div>

           <div class="col-span-2 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
              <div class="flex justify-between items-center mb-3">
                <span class="block text-slate-700 text-sm font-bold tracking-wide flex items-center">
                  <Droplets class="w-4 h-4 mr-1.5 text-blue-500" /> ค่าน้ำ 
                  <span class="text-xs font-normal text-slate-500 ml-2">({{ bill?.waterRate || 20 }} ฿/ยูนิต)</span>
                </span>
                <span class="font-bold text-lg text-blue-700">฿{{ ((Math.max(0, localBill.currWaterMeter - localBill.prevWaterMeter)) * (bill?.waterRate || 20)).toLocaleString() }}</span>
              </div>
              <div class="flex items-center space-x-3 text-sm">
                <div class="flex-1">
                  <label class="block text-[10px] text-slate-500 uppercase mb-1">มิเตอร์เดือนก่อน</label>
                  <div class="bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500 font-mono text-center cursor-not-allowed select-none">{{ localBill.prevWaterMeter }}</div>
                </div>
                <div class="text-slate-300 mt-4">
                  <ArrowRight class="w-4 h-4" />
                </div>
                <div class="flex-1">
                  <label class="block text-[10px] text-blue-600 font-bold uppercase mb-1">มิเตอร์เดือนนี้</label>
                  <input v-if="bill" v-model.number="localBill.currWaterMeter" @input="updateBillTotal" type="number" min="0" class="w-full border border-blue-300 rounded px-3 py-2 font-mono font-bold text-blue-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-center shadow-inner">
                </div>
                <div class="text-slate-300 mt-4">
                  <Equal class="w-4 h-4" />
                </div>
                <div class="w-16 text-center">
                  <label class="block text-[10px] text-slate-500 uppercase mb-1">จำนวนใช้</label>
                  <div class="font-bold text-slate-700 mt-2 font-mono">{{ Math.max(0, localBill.currWaterMeter - localBill.prevWaterMeter) }}</div>
                </div>
              </div>
           </div>
        </div>

        <div>
           <span class="block text-sm font-semibold text-slate-700 mb-2">สลิปโอนเงิน</span>
           
           <!-- Case 1: Paid or Cancelled (Preview Only) -->
           <div v-if="bill?.status === 'Paid' || bill?.status === 'Cancelled'" class="bg-slate-100 border-2 border-slate-300 rounded-xl min-h-[14rem] p-2 flex flex-col items-center justify-center text-slate-400 cursor-default relative overflow-hidden">
              <img :src="uploadedSlipUrl || 'https://images.unsplash.com/photo-1621315271772-28b1e3ebfd80?w=500&q=80'" alt="slip-preview" class="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-80 transition-opacity" />
              <div v-if="!uploadedSlipUrl" class="text-center relative z-10 py-4 px-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200">
                 <FileCheck class="w-10 h-10 mx-auto mb-2 text-slate-700" />
                 <p class="text-sm font-bold text-slate-800">สลิปอ้างอิง.jpg</p>
                 <p class="text-xs text-slate-600 mt-1 font-medium bg-slate-100 px-2 py-0.5 rounded shadow-sm inline-block">{{ bill?.status === 'Paid' ? 'ชำระแล้ว' : 'ยกเลิกแล้ว' }}</p>
              </div>
           </div>

           <!-- Case 2: Draft or Pending AND has uploaded locally -->
           <div v-else-if="uploadedSlipUrl" class="bg-slate-100 border-2 border-dashed border-primary-300 rounded-xl p-2 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden h-72" @click="triggerUpload">
              <img :src="uploadedSlipUrl" alt="uploaded-slip" class="w-full h-full object-contain drop-shadow-sm" />
              <div class="text-center absolute inset-2 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-lg">
                 <UploadCloud class="w-10 h-10 mx-auto mb-2 text-white drop-shadow-md" />
                 <p class="text-sm font-bold text-white drop-shadow-md">แตะเพื่อเปลี่ยนรูปสลิป</p>
              </div>
           </div>

           <!-- Case 3: Draft or Pending AND No Slip Yet -->
           <div v-else class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl h-46 min-h-[12rem] p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-primary-400 hover:text-primary-600 transition-colors group cursor-pointer relative" @click="triggerUpload">
              <div class="text-center group-hover:scale-105 transition-transform">
                 <div class="w-14 h-14 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-primary-500 transition-colors">
                    <UploadCloud class="w-6 h-6" />
                 </div>
                 <p class="text-sm font-bold text-slate-700 group-hover:text-primary-700">อัปโหลดสลิปการโอนเงิน</p>
                 <p class="text-xs mt-1">คลิกที่นี่เพื่อเลือกไฟล์ภาพ</p>
              </div>
           </div>

           <!-- Hidden File Input for Admin Upload -->
           <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center flex-shrink-0">
        <div>
          <button v-if="bill?.status !== 'Cancelled'" @click="cancelBill" class="px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors shadow-sm flex items-center">
            <XCircle class="w-4 h-4 mr-1.5" /> ยกเลิกบิล
          </button>
        </div>
        <div class="flex space-x-3">
          <button @click="saveBillData" class="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center">
            <Save class="w-4 h-4 mr-1.5" /> บันทึก
          </button>
          
          <button v-if="bill?.status === 'Draft'" @click="changeToPending" class="px-4 py-2.5 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 flex items-center transition-colors shadow-sm">
            <Clock class="w-4 h-4 mr-1.5" /> รอชำระ
          </button>
          
          <button v-if="bill?.status === 'Pending'" @click="approvePayment" class="px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center transition-colors shadow-sm">
            <Check class="w-4 h-4 mr-1.5" /> รับชำระ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { FileCheck, FileText, X, Check, Zap, Droplets, ArrowRight, Equal, UploadCloud, XCircle, Clock, Save } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  bill: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'approve', 'changeStatus', 'cancel'])

const localBill = ref({
  prevElecMeter: 0,
  currElecMeter: 0,
  prevWaterMeter: 0,
  currWaterMeter: 0
})

const fileInput = ref(null)
const uploadedSlipUrl = ref(null)

watch(() => props.bill, (newVal) => {
  // Clear file input mock state when modal opens a new bill
  uploadedSlipUrl.value = null
  if (fileInput.value) fileInput.value.value = ''

  if (newVal) {
    const elecUnits = newVal.elecUnits !== undefined ? newVal.elecUnits : (newVal.electric ? newVal.electric / (newVal.elecRate || 8) : 0)
    const waterUnits = newVal.waterUnits !== undefined ? newVal.waterUnits : (newVal.water ? newVal.water / (newVal.waterRate || 20) : 0)

    const prevElec = newVal.prevElecMeter || 9500
    const prevWater = newVal.prevWaterMeter || 1200

    localBill.value = {
      prevElecMeter: prevElec,
      currElecMeter: newVal.currElecMeter || (prevElec + elecUnits),
      prevWaterMeter: prevWater,
      currWaterMeter: newVal.currWaterMeter || (prevWater + waterUnits)
    }
  }
}, { immediate: true, deep: true })

const closeModal = () => {
  emit('close')
}

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadedSlipUrl.value = URL.createObjectURL(file)
  }
}

const updateBillTotal = () => {
  if (props.bill) {
    const elecUnits = Math.max(0, localBill.value.currElecMeter - localBill.value.prevElecMeter)
    const waterUnits = Math.max(0, localBill.value.currWaterMeter - localBill.value.prevWaterMeter)

    props.bill.elecUnits = elecUnits
    props.bill.waterUnits = waterUnits
    
    // Update electric/water if used in BillsView
    props.bill.electric = elecUnits * (props.bill.elecRate || 8)
    props.bill.water = waterUnits * (props.bill.waterRate || 20)

    const otherFeesTotal = (props.bill.otherFees || []).reduce((acc, f) => acc + f.amount, 0)

    props.bill.total = (props.bill.rent || 0) + 
      otherFeesTotal +
      (props.bill.electric || 0) + 
      (props.bill.water || 0) + 
      (props.bill.parkingFee || 0)
  }
}

const saveBillData = () => {
  updateBillTotal()
  Swal.fire({
    icon: 'success',
    title: 'บันทึกสำเร็จ',
    text: 'บันทึกข้อมูลบิลเรียบร้อยแล้ว',
    confirmButtonText: 'ตกลง',
    timer: 1500
  }).then(() => {
    closeModal()
  })
}

const approvePayment = () => {
  if (props.bill) {
    props.bill.status = 'Paid'
  }
  Swal.fire({
    icon: 'success',
    title: 'สำเร็จ',
    text: `✅ รับชำระเงินบิล ${props.bill?.code} เรียบร้อยแล้ว`,
    confirmButtonText: 'ตกลง',
    timer: 1500
  }).then(() => {
    emit('approve', props.bill)
    closeModal()
  })
}

const changeToPending = () => {
  if (props.bill) {
    props.bill.status = 'Pending'
  }
  emit('changeStatus', { bill: props.bill, status: 'Pending' })
  closeModal()
}

const cancelBill = () => {
  Swal.fire({
    title: 'ยืนยันการยกเลิกบิล',
    text: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกบิลนี้?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'กลับ',
  }).then((result) => {
    if (result.isConfirmed) {
      if (props.bill) {
        props.bill.status = 'Cancelled'
      }
      emit('cancel', props.bill)
      closeModal()
    }
  })
}
</script>
