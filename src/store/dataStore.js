import { reactive } from 'vue'

export const dataStore = reactive({
  customers: [
    { id: 1, name: 'สมชาย รักดี', idCard: '1100200300400', room: 'A101', phone: '081-234-5678', parkingZone: 1, status: 'Active' },
    { id: 2, name: 'สมหญิง สุขใจ', idCard: '1200300400500', room: 'A102', phone: '089-876-5432', parkingZone: '', status: 'Active' },
    { id: 3, name: 'มานะ มานี', idCard: '1300400500600', room: 'B205', phone: '085-111-2222', parkingZone: 2, status: 'Inactive' },
    { id: 4, name: 'ปิติ ชูใจ', idCard: '1400500600700', room: 'C301', phone: '082-333-4444', parkingZone: 1, status: 'Active' },
    { id: 5, name: 'วีระ เก่งกาจ', idCard: '1500600700800', room: 'A105', phone: '084-555-6666', parkingZone: '', status: 'Active' },
    { id: 6, name: 'สมร ทรัพย์อนันต์', idCard: '1600700800900', room: '', phone: '081-999-8888', parkingZone: 1, status: 'Active' },
    { id: 7, name: 'ชูเกียรติ ยั่งยืน', idCard: '1700800900100', room: '', phone: '089-777-6666', parkingZone: '', status: 'Active' },
  ],
  buildings: [
    {
      id: 'b_1',
      name: 'อาคาร A',
      floors: [
        { id: 'f_1_1', level: '1', rooms: [{ number: 'A101', status: 'Occupied', tenant: 'สมชาย รักดี', rent: 4500 }, { number: 'A102', status: 'Maintenance', tenant: null, rent: 4500 }] },
        { id: 'f_1_2', level: '2', rooms: [{ number: 'A201', status: 'Vacant', tenant: null, rent: 4500 }, { number: 'A202', status: 'Occupied', tenant: 'มานะ ใจดี', rent: 4500 }] }
      ]
    },
    {
      id: 'b_2',
      name: 'อาคาร B',
      floors: [
        { id: 'f_2_1', level: '1', rooms: [{ number: 'B101', status: 'Occupied', tenant: 'วันชัย งามสุด', rent: 5000 }] }
      ]
    }
  ],
  bills: [
    { id: 1, monthCode: '2023-10', month: 'ตุลาคม 2023', code: 'INV-202310-001', room: 'A101', createdAt: '01 ต.ค. 2023', total: 6800, status: 'Paid', rent: 4500, parkingFee: 1000, electric: 850, water: 150, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 100, elecRate: 8, waterUnits: 10, waterRate: 20 },
    { id: 2, monthCode: '2023-10', month: 'ตุลาคม 2023', code: 'INV-202310-002', room: 'A102', createdAt: '01 ต.ค. 2023', total: 5570, status: 'Pending', rent: 4500, parkingFee: 0, electric: 620, water: 150, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 77.5, elecRate: 8, waterUnits: 10, waterRate: 20 },
    { id: 3, monthCode: '2023-10', month: 'ตุลาคม 2023', code: 'INV-202310-003', room: 'B205', createdAt: '01 ต.ค. 2023', total: 8200, status: 'Draft', rent: 5000, parkingFee: 1500, electric: 1200, water: 200, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 150, elecRate: 8, waterUnits: 10, waterRate: 20 },
    { id: 4, monthCode: '2023-10', month: 'ตุลาคม 2023', code: 'INV-202310-004', room: 'C301', createdAt: '01 ต.ค. 2023', total: 5850, status: 'Cancelled', rent: 4000, parkingFee: 1000, electric: 450, water: 100, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 56.25, elecRate: 8, waterUnits: 5, waterRate: 20 },
    { id: 5, monthCode: '2023-09', month: 'กันยายน 2023', code: 'INV-202309-001', room: 'A101', createdAt: '01 ก.ย. 2023', total: 6750, status: 'Paid', rent: 4500, parkingFee: 1000, electric: 800, water: 150, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 100, elecRate: 8, waterUnits: 15, waterRate: 20 },
    { id: 6, monthCode: '2023-09', month: 'กันยายน 2023', code: 'INV-202309-002', room: 'A102', createdAt: '01 ก.ย. 2023', total: 5500, status: 'Paid', rent: 4500, parkingFee: 0, electric: 550, water: 150, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 68.75, elecRate: 8, waterUnits: 7.5, waterRate: 20 },
    { id: 7, monthCode: '2023-09', month: 'กันยายน 2023', code: 'INV-202309-003', room: 'B205', createdAt: '04 ก.ย. 2023', total: 8100, status: 'Paid', rent: 5000, parkingFee: 1500, electric: 1100, water: 200, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 137.5, elecRate: 8, waterUnits: 10, waterRate: 20 },
    { id: 8, monthCode: '2023-09', month: 'กันยายน 2023', code: 'INV-202309-004', room: 'C301', createdAt: '05 ก.ย. 2023', total: 5880, status: 'Paid', rent: 4000, parkingFee: 1000, electric: 480, water: 100, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 60, elecRate: 8, waterUnits: 5, waterRate: 20 },
    { id: 9, monthCode: '2023-08', month: 'สิงหาคม 2023', code: 'INV-202308-001', room: 'A101', createdAt: '01 ส.ค. 2023', total: 6770, status: 'Paid', rent: 4500, parkingFee: 1000, electric: 820, water: 150, otherFees: [{id:1, name:'ค่าส่วนกลาง', amount:300}], elecUnits: 102.5, elecRate: 8, waterUnits: 7.5, waterRate: 20 }
  ],
  broadcast: {
    broadcastType: 'water',
    templates: {
      water: {
        active: true,
        audience: 'ผู้เช่าทั้งหมด',
        scheduleDay: '25',
        scheduleTime: '10:00',
        messageBody: 'เรียนคุณ {name} ห้อง {room},\n\nทางอพาร์ทเมนต์ขอแจ้งให้ส่งหมายเลขมิเตอร์น้ำของเดือนนี้\n\nขอบคุณค่ะ'
      },
      electric: {
        active: true,
        audience: 'ผู้เช่าทั้งหมด',
        scheduleDay: '25',
        scheduleTime: '10:00',
        messageBody: 'เรียนคุณ {name} ห้อง {room},\n\nทางอพาร์ทเมนต์ขอแจ้งให้ส่งหมายเลขมิเตอร์ไฟฟ้าของเดือนนี้\n\nขอบคุณค่ะ'
      },
      payment: {
        active: false,
        audience: 'เฉพาะคนที่ค้างชำระบิล',
        scheduleDay: '5',
        scheduleTime: '10:00',
        messageBody: 'เรียนคุณ {name} ห้อง {room},\n\nทางอพาร์ทเมนต์ขอแจ้งเตือนยอดค้างชำระบิลจำนวน {amount} บาท รบกวนช่วยชำระเงินด้วยครับ\n\nขอบคุณค่ะ'
      }
    }
  }
})
