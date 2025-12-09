<template>
  <aside class="w-64 bg-white shadow-md p-6 space-y-6 hidden lg:block h-full">
    <h1 class="text-2xl font-bold mb-6">Hotel Admin</h1>

    <nav class="space-y-3">
      <router-link to="/" class="block p-3 rounded-lg hover:bg-gray-200"
        >Dashboard</router-link
      >
      <router-link to="/rooms" class="block p-3 rounded-lg hover:bg-gray-200"
        >Room Management</router-link
      >
      <router-link to="/bookings" class="block p-3 rounded-lg hover:bg-gray-200"
        >Bookings</router-link
      >
      <router-link
        to="/customers"
        class="block p-3 rounded-lg hover:bg-gray-200"
        >Customers</router-link
      >
      <router-link to="/settings" class="block p-3 rounded-lg hover:bg-gray-200"
        >Settings</router-link
      >
    </nav>
  </aside>
</template>
