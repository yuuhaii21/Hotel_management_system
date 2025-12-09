<template>
<div>
<h2 class="text-2xl font-bold mb-4">Bookings</h2>
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
</template>


<script setup>
import { ref } from 'vue'
const bookings = ref([
{ id: 1, customer: 'Sok Dara', room: '101', date: '2025-12-01', status: 'Confirmed' },
{ id: 2, customer: 'Chan Nita', room: '102', date: '2025-12-02', status: 'Pending' }
])
const statusColor = s => s === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-500'
</script>