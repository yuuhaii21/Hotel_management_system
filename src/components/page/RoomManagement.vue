<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Room Management</h2>
    <button
      @click="addRoom"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
    >
      Add Room
    </button>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="bg-white p-4 rounded-xl shadow-md"
      >
        <h3 class="font-bold">Room #{{ room.number }}</h3>
        <p class="text-gray-600">Type: {{ room.type }}</p>
        <p class="text-gray-600">Price: ${{ room.price }}</p>
        <div class="flex gap-2 mt-3">
          <button class="px-3 py-1 bg-yellow-500 text-white rounded">
            Edit
          </button>
          <button
            @click="deleteRoom(room.id)"
            class="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const rooms = ref([
  { id: 1, number: 101, type: "Deluxe", price: 120 },
  { id: 2, number: 102, type: "Standard", price: 90 },
]);

const addRoom = () => {
  const id = rooms.value.length + 1;
  rooms.value.push({ id, number: 100 + id, type: "Standard", price: 100 });
};
const deleteRoom = (id) =>
  (rooms.value = rooms.value.filter((r) => r.id !== id));
</script>
