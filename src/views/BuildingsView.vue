<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h2 class="text-2xl font-bold text-slate-800">จัดการอาคารและชั้น</h2>
      <button @click="openBuildingModal('add')" class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center space-x-2">
        <Plus class="w-5 h-5 sm:w-4 sm:h-4" />
        <span>เพิ่มอาคารใหม่</span>
      </button>
    </div>

    <!-- Toolbar: Select Building and Building Actions -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div v-if="buildings.length > 0" class="flex flex-col md:flex-row md:items-center gap-4 w-full">
        <!-- Select Building Section -->
        <div class="flex items-center space-x-3 w-full md:w-auto">
          <div class="p-2 bg-primary-50 text-primary-600 rounded-lg shrink-0">
            <Filter class="w-5 h-5" />
          </div>
          <span class="font-semibold text-slate-700 shrink-0">เลือกอาคาร:</span>
          <select v-model="selectedBuildingId" class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-slate-800 outline-none w-full md:w-56 bg-slate-50 flex-1">
            <option v-for="b in buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        
        <!-- Action Buttons -->
        <div v-if="currentBuilding" class="flex items-center space-x-2 w-full md:w-auto">
          <button @click="openBuildingModal('edit', currentBuilding)" class="flex-1 md:flex-none text-blue-600 border border-blue-200 hover:text-blue-800 px-3 py-2 md:py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1 text-sm font-medium">
            <Edit class="w-4 h-4 shrink-0" />
            <span class="whitespace-nowrap">แก้ไขชื่อ</span><span class="hidden sm:inline whitespace-nowrap">อาคาร</span>
          </button>
          <button @click="openConfirmDelete('building', currentBuilding)" class="flex-1 md:flex-none text-red-500 border border-red-200 hover:text-red-700 px-3 py-2 md:py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-1 text-sm font-medium">
            <Trash2 class="w-4 h-4 shrink-0" />
            <span class="whitespace-nowrap">ลบ</span><span class="hidden sm:inline whitespace-nowrap">อาคาร</span>
          </button>
        </div>
      </div>
      <div v-else class="text-slate-500 font-medium italic flex-1">
        ยังไม่มีอาคารในระบบ กรุณาสร้างอาคารก่อน
      </div>
      
      <!-- Search Input -->
      <div v-if="buildings.length > 0" class="relative w-full sm:w-auto">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" v-model="searchQuery" placeholder="ค้นหาห้อง, ผู้เช่า..." class="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-full sm:w-64 bg-slate-50">
      </div>
    </div>

    <!-- Current Building Content -->
    <div v-if="currentBuilding" class="space-y-8">
      
      <!-- Empty State for Floors -->
      <div v-if="currentBuilding.floors.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 border-dashed">
        <Layers class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p class="text-slate-500 mb-4 font-medium">ยังไม่มีข้อมูลชั้นในอาคารนี้</p>
        <button @click="openFloorModal('add')" class="text-primary-600 font-semibold hover:underline px-4 py-2 hover:bg-primary-50 rounded transition-colors">คลิกที่นี่เพื่อเพิ่มชั้น</button>
      </div>

      <!-- Floors Loop -->
      <div v-for="floor in sortedFloors" :key="floor.id" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        
        <!-- Floor Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 relative z-10">
          <div class="flex items-center space-x-3">
             <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shadow-inner">
               <Layers class="w-5 h-5" />
             </div>
             <h3 class="text-xl font-bold text-slate-800">ชั้น {{ floor.level }}</h3>
          </div>
          <div class="flex space-x-2">
            <button @click="openFloorModal('edit', floor)" class="text-slate-600 hover:text-blue-600 text-sm font-medium px-3 py-1.5 flex items-center bg-slate-50 border border-slate-200 hover:border-blue-300 rounded transition-colors">
              <Edit class="w-4 h-4 mr-1.5" />
              แก้ไข
            </button>
            <button @click="openConfirmDelete('floor', floor)" class="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 flex items-center bg-red-50 border border-red-100 hover:border-red-300 rounded transition-colors">
              <Trash2 class="w-4 h-4 mr-1.5" />
              ลบชั้น
            </button>
          </div>
        </div>
        
        <!-- Room Cards Grid -->
        <div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          <div v-for="room in floor.rooms" :key="room.number" 
               class="flex flex-col rounded-xl border p-5 transition-all shadow-sm hover:shadow-md h-full"
               :class="{
                 'bg-emerald-50/40 border-emerald-200': room.status === 'Occupied',
                 'bg-primary-50/40 border-primary-200': room.status === 'Reserved',
                 'bg-white border-slate-200': room.status === 'Vacant',
                 'bg-amber-50/40 border-amber-200': room.status === 'Maintenance'
               }">
            
            <div class="flex justify-between items-start mb-4">
              <h4 class="text-2xl font-bold tracking-tight" :class="{
                'text-emerald-700': room.status === 'Occupied',
                'text-primary-700': room.status === 'Reserved',
                'text-slate-700': room.status === 'Vacant',
                'text-amber-700': room.status === 'Maintenance'
              }">
                {{ room.number }}
              </h4>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm whitespace-nowrap"
                    :class="{
                      'bg-emerald-100 text-emerald-700': room.status === 'Occupied',
                      'bg-primary-100 text-primary-700': room.status === 'Reserved',
                      'bg-slate-100 text-slate-600': room.status === 'Vacant',
                      'bg-amber-100 text-amber-700': room.status === 'Maintenance'
                    }">
                {{ room.status === 'Occupied' ? 'มีผู้เช่า' : room.status === 'Reserved' ? 'ติดจอง' : room.status === 'Maintenance' ? 'ไม่พร้อมเข้าอยู่' : 'ว่าง' }}
              </span>
            </div>
            
            <div class="space-y-2.5 text-sm mt-5">
              <div class="flex space-x-2 mb-2" v-if="room.hasAirCon || room.hasFan">
                 <span v-if="room.hasAirCon" class="flex items-center text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md border border-cyan-100" title="มีแอร์">
                    <Snowflake class="w-3.5 h-3.5 mr-1" /> แอร์
                 </span>
                 <span v-if="room.hasFan" class="flex items-center text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded-md border border-slate-200" title="มีพัดลม">
                    <Fan class="w-3.5 h-3.5 mr-1" /> พัดลม
                 </span>
              </div>
              <div class="flex justify-between items-center text-slate-600 bg-white/50 rounded py-1">
                <span class="flex items-center space-x-2"><User class="w-4 h-4 text-slate-400" /> <span>ผู้เช่า:</span></span>
                <span class="font-medium text-slate-800 truncate max-w-[120px]">{{ room.tenant || '-' }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600 bg-white/50 rounded py-1">
                <span class="flex items-center space-x-2"><Wallet class="w-4 h-4 text-slate-400" /> <span>ค่าเช่า:</span></span>
                <span class="font-medium text-slate-800 font-mono">฿{{ room.rent.toLocaleString() }}</span>
              </div>
              <div v-if="room.note" class="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-2 line-clamp-2">
                <span class="font-semibold text-slate-600">หมายเหตุ:</span> {{ room.note }}
              </div>
            </div>
            
            <div class="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center">
              <router-link :to="`/rooms/${room.number}`" class="flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md transition-colors text-xs font-bold">
                <FileText class="w-3.5 h-3.5 mr-1.5" /> รายการเช่า
              </router-link>
              <div class="flex space-x-2">
                <button @click="openRoomModal('edit', floor.id, room)" class="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-blue-600 hover:bg-blue-50 transition-colors text-xs font-semibold">
                  <Edit class="w-3.5 h-3.5 mr-1.5" /> แก้ไข
                </button>
                <button @click="openConfirmDelete('room', room, floor.id)" class="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-red-500 hover:bg-red-50 transition-colors text-xs font-semibold">
                  <Trash2 class="w-3.5 h-3.5 mr-1.5" /> ลบ
                </button>
              </div>
            </div>
          </div>
          
          <!-- Add Room Button Hook -->
          <div @click="openRoomModal('add', floor.id)" class="rounded-xl border border-dashed border-slate-300 p-5 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer min-h-[160px]">
             <Plus class="w-8 h-8 mb-2 opacity-50 text-inherit" />
             <span class="font-medium text-sm">เพิ่มห้องใหม่</span>
          </div>
        </div>
      </div>
      
      <!-- Mock Add Floor Placeholder -->
      <div v-if="currentBuilding.floors.length > 0" @click="openFloorModal('add')" class="rounded-xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer w-full min-h-[140px] mt-8 bg-white/50">
        <Plus class="w-8 h-8 mb-2 opacity-50 text-inherit" />
        <span class="font-medium text-lg">เพิ่มชั้นใหม่ในอาคารนี้</span>
      </div>

    </div>
    <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">

      <Building class="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-slate-600 mb-2">ยังไม่มีอาคารในระบบ</h3>
      <button @click="openBuildingModal('add')" class="text-primary-600 font-semibold hover:underline">สร้างอาคารแรกของคุณเลย</button>
    </div>

    <!-- Modal Building -->
    <div v-if="isBuildingModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form @submit.prevent="saveBuilding">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-lg text-slate-800">{{ bModalMode === 'add' ? 'เพิ่มอาคารใหม่' : 'แก้ไขชื่ออาคาร' }}</h3>
            <button type="button" @click="isBuildingModalOpen = false" class="text-slate-400 hover:text-slate-600 transition-colors"><X class="w-5 h-5"/></button>
          </div>
          <div class="p-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">ชื่ออาคาร <span class="text-red-500">*</span></label>
            <input v-model="bForm.name" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น อาคาร A, ตึก B">
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" @click="isBuildingModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">บันทึก</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Floor Modal -->
    <div v-if="isFloorModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form @submit.prevent="saveFloor">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-lg text-slate-800">{{ fModalMode === 'add' ? `เพิ่มชั้นใน ${currentBuilding?.name}` : 'แก้ไขเลขชั้น' }}</h3>
            <button type="button" @click="isFloorModalOpen = false" class="text-slate-400 hover:text-slate-600 transition-colors"><X class="w-5 h-5"/></button>
          </div>
          <div class="p-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">ระบุหมายเลขชั้น / ชั้นที่ <span class="text-red-500">*</span></label>
            <input v-model="fForm.level" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น 1, 2, G, M">
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" @click="isFloorModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors">บันทึก</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Room Modal -->
    <div v-if="isRoomModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form @submit.prevent="saveRoom">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-lg text-slate-800">{{ rModalMode === 'add' ? 'เพิ่มห้องพักใหม่' : 'แก้ไขข้อมูลห้องพัก' }}</h3>
            <button type="button" @click="isRoomModalOpen = false" class="text-slate-400 hover:text-slate-600 transition-colors"><X class="w-5 h-5"/></button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">หมายเลขห้อง <span class="text-red-500">*</span></label>
              <input v-model="rForm.number" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="เช่น A101">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">สถานะการเช่า</label>
                <select v-model="rForm.status" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                  <option value="Vacant">ว่าง</option>
                  <option value="Occupied">มีผู้เช่า</option>
                  <option value="Reserved">ติดจอง</option>
                  <option value="Maintenance">ไม่พร้อมเข้าอยู่</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">ค่าเช่ารายเดือน (บาท)</label>
                <input v-model="rForm.rent" type="number" required min="0" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="0">
              </div>
            </div>

            <!-- Amenities -->
            <div class="flex space-x-6 mt-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="rForm.hasAirCon" type="checkbox" class="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500">
                <span class="text-sm font-medium text-slate-700">มีแอร์</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="rForm.hasFan" type="checkbox" class="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500">
                <span class="text-sm font-medium text-slate-700">มีพัดลม</span>
              </label>
            </div>

            <!-- Optional Tenant Input -->
            <div v-if="rForm.status === 'Occupied'">
              <label class="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้เช่าปัจจุบัน <span class="text-slate-400 font-normal text-xs ml-1">(ระบุอัตโนมัติ)</span></label>
              <input v-model="rForm.tenant" type="text" disabled class="w-full border border-slate-300 bg-slate-100/70 text-slate-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed outline-none" placeholder="ดึงข้อมูลอัตโนมัติจากระบบเช่าห้อง">
            </div>

            <!-- Note -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">หมายเหตุ</label>
              <textarea v-model="rForm.note" rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none" placeholder="รายละเอียดเพิ่มเติมของห้อง"></textarea>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" @click="isRoomModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">บันทึก</button>
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
          <h3 class="font-bold text-xl text-slate-800 mb-2">ยืนยันการลบ</h3>
          <p class="text-slate-500 text-sm mb-4">
            คุณต้องการถาวรการลบ
            <strong v-if="deleteTarget.type === 'building'">อาคาร "{{ deleteTarget.item.name }}"</strong>
            <strong v-if="deleteTarget.type === 'floor'">ชั้น "{{ deleteTarget.item.level }}"</strong>
            <strong v-if="deleteTarget.type === 'room'">ห้อง "{{ deleteTarget.item.number }}"</strong>
            ใช่หรือไม่?
          </p>
          <div v-if="deleteTarget.type !== 'room'" class="p-3 bg-red-50 border border-red-100 rounded-lg text-xs leading-5 text-red-600 text-left">
            <strong>คำเตือน:</strong> ข้อมูลทั้งหมดที่อยู่ภายในจะถูกลบและไม่สามารถกู้คืนได้!
          </div>
        </div>
        <div class="px-6 py-4 bg-slate-50 flex justify-center space-x-3 gap-2">
          <button @click="isDeleteModalOpen = false" class="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">ยกเลิก</button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">ยืนยันการลบ</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Plus, Edit, Trash2, X, Filter, AlertTriangle, Layers, Building, User, Wallet, FileText, Snowflake, Fan, Search } from 'lucide-vue-next'
import { dataStore } from '../store/dataStore'

// --- State ---
const generateId = () => Math.random().toString(36).substr(2, 9)

const buildings = computed(() => dataStore.buildings)

const selectedBuildingId = ref('b_1')
const searchQuery = ref('')

// Computed
const currentBuilding = computed(() => {
  return buildings.value.find(b => b.id === selectedBuildingId.value)
})

const sortedFloors = computed(() => {
  if (!currentBuilding.value) return []
  
  let floors = currentBuilding.value.floors
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    floors = floors.map(floor => {
      const filteredRooms = floor.rooms.filter(r => 
        String(r.number).toLowerCase().includes(query) || 
        (r.tenant && String(r.tenant).toLowerCase().includes(query)) ||
        (r.note && String(r.note).toLowerCase().includes(query))
      )
      return { ...floor, rooms: filteredRooms }
    }).filter(floor => floor.rooms.length > 0 || String(floor.level).toLowerCase().includes(query))
  }
  
  return [...floors].sort((a, b) => 
    String(a.level).localeCompare(String(b.level), undefined, { numeric: true })
  )
})

// Ensures selection fallback if a building is deleted
watch(buildings, (newVal) => {
  if (newVal.length > 0) {
    if (!newVal.find(b => b.id === selectedBuildingId.value)) {
      selectedBuildingId.value = newVal[0].id
    }
  } else {
    selectedBuildingId.value = null
  }
}, { deep: true })


// --- Building Management ---
const isBuildingModalOpen = ref(false)
const bModalMode = ref('add')
const bForm = reactive({ id: null, name: '' })

const openBuildingModal = (mode, building = null) => {
  bModalMode.value = mode
  if (mode === 'edit' && building) {
    bForm.id = building.id
    bForm.name = building.name
  } else {
    bForm.id = null
    bForm.name = ''
  }
  isBuildingModalOpen.value = true
}

const saveBuilding = () => {
  if (bModalMode.value === 'add') {
    const newBuilding = { id: `b_${generateId()}`, name: bForm.name, floors: [] }
    dataStore.buildings.push(newBuilding)
    selectedBuildingId.value = newBuilding.id
  } else {
    const idx = dataStore.buildings.findIndex(b => b.id === bForm.id)
    if (idx !== -1) {
      dataStore.buildings[idx].name = bForm.name
    }
  }
  isBuildingModalOpen.value = false
}

// --- Floor Management ---
const isFloorModalOpen = ref(false)
const fModalMode = ref('add')
const fForm = reactive({ id: null, level: '' })

const openFloorModal = (mode, floor = null) => {
  fModalMode.value = mode
  if (mode === 'edit' && floor) {
    fForm.id = floor.id
    fForm.level = floor.level
  } else {
    fForm.id = null
    fForm.level = ''
  }
  isFloorModalOpen.value = true
}

const saveFloor = () => {
  if (!currentBuilding.value) return
  
  if (fModalMode.value === 'add') {
    const newFloor = { id: `f_${generateId()}`, level: String(fForm.level), rooms: [] }
    currentBuilding.value.floors.push(newFloor)
  } else {
    const floor = currentBuilding.value.floors.find(f => f.id === fForm.id)
    if (floor) {
      floor.level = String(fForm.level)
    }
  }
  isFloorModalOpen.value = false
}

// --- Room Management ---
const isRoomModalOpen = ref(false)
const rModalMode = ref('add')
const selectedFloorIdForRoom = ref(null)

const rForm = reactive({
  originalNumber: null,
  number: '',
  status: 'Vacant',
  tenant: '',
  rent: 0,
  hasAirCon: false,
  hasFan: false,
  note: ''
})

const openRoomModal = (mode, floorId, room = null) => {
  rModalMode.value = mode
  selectedFloorIdForRoom.value = floorId
  if (mode === 'edit' && room) {
    rForm.originalNumber = room.number
    rForm.number = room.number
    rForm.status = room.status
    rForm.tenant = room.tenant || ''
    rForm.rent = room.rent || 0
    rForm.hasAirCon = room.hasAirCon || false
    rForm.hasFan = room.hasFan || false
    rForm.note = room.note || ''
  } else {
    rForm.originalNumber = null
    rForm.number = ''
    rForm.status = 'Vacant'
    rForm.tenant = ''
    rForm.rent = 0
    rForm.hasAirCon = false
    rForm.hasFan = false
    rForm.note = ''
  }
  isRoomModalOpen.value = true
}

const saveRoom = () => {
  if (!currentBuilding.value) return
  const floor = currentBuilding.value.floors.find(f => f.id === selectedFloorIdForRoom.value)
  if (!floor) return

  const tenantName = rForm.status === 'Occupied' ? rForm.tenant : null

  if (rModalMode.value === 'add') {
    floor.rooms.push({
      number: rForm.number,
      status: rForm.status,
      tenant: tenantName,
      rent: Number(rForm.rent),
      hasAirCon: rForm.hasAirCon,
      hasFan: rForm.hasFan,
      note: rForm.note
    })
  } else if (rModalMode.value === 'edit') {
    const rIndex = floor.rooms.findIndex(r => r.number === rForm.originalNumber)
    if (rIndex !== -1) {
      floor.rooms[rIndex] = {
        number: rForm.number,
        status: rForm.status,
        tenant: tenantName,
        rent: Number(rForm.rent),
        hasAirCon: rForm.hasAirCon,
        hasFan: rForm.hasFan,
        note: rForm.note
      }
    }
  }
  isRoomModalOpen.value = false
}

// --- Unified Delete Action ---
const isDeleteModalOpen = ref(false)
const deleteTarget = reactive({ type: '', item: null, parentId: null })

const openConfirmDelete = (type, item, parentId = null) => {
  deleteTarget.type = type
  deleteTarget.item = item
  deleteTarget.parentId = parentId
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (deleteTarget.type === 'building') {
    dataStore.buildings = dataStore.buildings.filter(b => b.id !== deleteTarget.item.id)
  } else if (deleteTarget.type === 'floor' && currentBuilding.value) {
    currentBuilding.value.floors = currentBuilding.value.floors.filter(f => f.id !== deleteTarget.item.id)
  } else if (deleteTarget.type === 'room' && currentBuilding.value) {
    const floor = currentBuilding.value.floors.find(f => f.id === deleteTarget.parentId)
    if (floor) {
      floor.rooms = floor.rooms.filter(r => r.number !== deleteTarget.item.number)
    }
  }
  isDeleteModalOpen.value = false
  deleteTarget.item = null
  deleteTarget.parentId = null
}

</script>
