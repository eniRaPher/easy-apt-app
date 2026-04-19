import { reactive } from 'vue'

// Global Settings Store
export const settingsStore = reactive({
  projectName: 'ระบบจัดการอพาร์ทเม้นท์ Easy Apt',
  phone: '081-234-5678',
  lineId: '@easyapt',
  facebook: 'https://facebook.com/easyapt',
  address: '123/4 หมู่ 5 ต.ช้างเผือก อ.เมือง จ.เชียงใหม่ 50300',
  elecRate: 8,
  waterRate: 20,
  otherFees: [
    { id: 1, name: 'ค่าส่วนกลาง', amount: 300 }
  ],
  parkingZones: [
    { id: 1, name: 'โซนทั่วไป (รถยนต์)', rate: 1000 },
    { id: 2, name: 'โซน VIP', rate: 1500 }
  ]
})
