<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-6 space-y-6 hidden lg:block">
      <h1 class="text-2xl font-bold mb-6">Hotel Admin</h1>
      <nav class="space-y-3">
        <button @click="activePage = 'dashboard'" class="w-full text-left p-3 rounded-lg hover:bg-gray-200" :class="isActive('dashboard')">Dashboard</button>
        <button @click="activePage = 'rooms'" class="w-full text-left p-3 rounded-lg hover:bg-gray-200" :class="isActive('rooms')">Room Management</button>
        <button @click="activePage = 'bookings'" class="w-full text-left p-3 rounded-lg hover:bg-gray-200" :class="isActive('bookings')">Bookings</button>
        <button @click="activePage = 'customers'" class="w-full text-left p-3 rounded-lg hover:bg-gray-200" :class="isActive('customers')">Customers</button>
        <button @click="activePage = 'settings'" class="w-full text-left p-3 rounded-lg hover:bg-gray-200" :class="isActive('settings')">Settings</button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <!-- Dashboard -->
      <div v-if="activePage === 'dashboard'" class="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <div class="col-span-1" v-for="card in cards" :key="card.title">
          <div class="rounded-2xl shadow-md p-4 bg-white flex items-center gap-4">
            <component :is="card.icon" class="w-10 h-10" />
            <div>
              <h2 class="text-xl font-bold">{{ card.value }}</h2>
              <p class="text-sm text-gray-500">{{ card.title }}</p>
            </div>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-4 rounded-2xl shadow-md p-6 bg-white">
          <h2 class="text-xl font-bold mb-4">Weekly Bookings</h2>
          <canvas id="bookingChart"></canvas>
        </div>
      </div>

      <!-- Rooms Page -->
      <div v-if="activePage === 'rooms'" class="space-y-4">
        <h2 class="text-2xl font-bold mb-2">Room Management</h2>
        <button @click="addRoom" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Room</button>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="room in rooms" :key="room.id" class="bg-white p-4 rounded-xl shadow-md">
            <h3 class="font-bold">Room #{{ room.number }}</h3>
            <p class="text-gray-600">Type: {{ room.type }}</p>
            <p class="text-gray-600">Price: ${{ room.price }}</p>
            <div class="flex gap-2 mt-3">
              <button class="px-3 py-1 bg-yellow-500 text-white rounded" @click="editRoom(room.id)">Edit</button>
              <button class="px-3 py-1 bg-red-600 text-white rounded" @click="deleteRoom(room.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Page -->
      <div v-if="activePage === 'bookings'" class="space-y-4">
        <h2 class="text-2xl font-bold">Bookings</h2>
        <table class="w-full bg-white rounded-xl shadow-md overflow-hidden">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-3 text-left">Customer</th>
              <th class="p-3 text-left">Room</th>
              <th class="p-3 text-left">Date</th>
              <th class="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bookings" :key="b.id" class="border-b">
              <td class="p-3">{{ b.customer }}</td>
              <td class="p-3">{{ b.room }}</td>
              <td class="p-3">{{ b.date }}</td>
              <td class="p-3"><span class="px-2 py-1 rounded text-white" :class="statusColor(b.status)">{{ b.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Customers Page -->
      <div v-if="activePage === 'customers'" class="space-y-4">
        <h2 class="text-2xl font-bold">Customers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="c in customers" :key="c.id" class="bg-white p-4 shadow-md rounded-xl">
            <h3 class="font-bold">{{ c.name }}</h3>
            <p class="text-gray-600">Phone: {{ c.phone }}</p>
            <p class="text-gray-600">Email: {{ c.email }}</p>
          </div>
        </div>
      </div>

      <!-- Settings Page -->
      <div v-if="activePage === 'settings'">
        <h2 class="text-2xl font-bold mb-4">Settings</h2>
        <p class="text-gray-600">Coming soon...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BedDouble, Users, Calendar, DollarSign } from 'lucide-vue-next'


const activePage = ref('dashboard')
const isActive = (page) => activePage.value === page ? 'bg-blue-200' : ''

const cards = [
  { title: 'Available Rooms', value: 120, icon: BedDouble },
  { title: 'Occupancy Rate', value: '85%', icon: Users },
  { title: "Today's Bookings", value: 32, icon: Calendar },
  { title: 'Monthly Revenue', value: '$12,450', icon: DollarSign }
]

onMounted(() => {
  const ctx = document.getElementById('bookingChart')
  if (ctx) new Chart(ctx, { type: 'bar', data: chartData })
})

const chartData = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets: [{ label: 'Bookings', data: [40,55,30,70,90,120,80], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 8 }]
}

// Room Management Data
const rooms = ref([
  { id: 1, number: 101, type: 'Deluxe', price: 120 },
  { id: 2, number: 102, type: 'Standard', price: 90 },
  { id: 3, number: 103, type: 'Suite', price: 180 }
])

const addRoom = () => {
  const id = rooms.value.length + 1
  rooms.value.push({ id, number: 100 + id, type: 'Standard', price: 100 })
}
const editRoom = (id) => alert('Edit room ' + id)
const deleteRoom = (id) => rooms.value = rooms.value.filter(r => r.id !== id)

// Bookings
const bookings = ref([
  { id: 1, customer: 'Sok Dara', room: '101', date: '2025-12-01', status: 'Confirmed' },
  { id: 2, customer: 'Chan Nita', room: '102', date: '2025-12-02', status: 'Pending' }
])

const statusColor = (status) => status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-500'

// Customers
const customers = ref([
  { id: 1, name: 'Sok Dara', phone: '012345678', email: 'dara@mail.com' },
  { id: 2, name: 'Chan Nita', phone: '099888777', email: 'nita@mail.com' }
])
</script>

<style scoped>
#bookingChart { height: 300px; }
</style>
