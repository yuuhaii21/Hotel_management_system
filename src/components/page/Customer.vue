<template>
  <div class="page">
    <h2>Customer Management</h2>

    <div class="top-bar">
      <input v-model="search" placeholder="Search customers..." />
      <button class="btn add" @click="startAdd">Add Customer</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th><th>Phone</th><th>Email</th><th style="width:150px">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in filtered" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.email }}</td>
          <td>
            <button class="btn edit" @click="startEdit(c)">Edit</button>
            <button class="btn delete" @click="remove(c.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="form-box">
      <h3>{{ form.id ? "Edit" : "Add" }} Customer</h3>

      <input v-model="form.name" placeholder="Full name" />
      <input v-model="form.phone" placeholder="Phone" />
      <input v-model="form.email" placeholder="Email" />

      <div class="form-actions">
        <button class="btn save" @click="save">Save</button>
        <button class="btn cancel" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const showForm = ref(false);

const customers = ref([
  // { id: 1, name: "John Doe", phone: "012345678", email: "john@mail.com" }
]);

const form = ref({});

const filtered = computed(() =>
  customers.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

function startAdd() {
  form.value = { name: "", phone: "", email: "" };
  showForm.value = true;
}

function startEdit(c) {
  form.value = { ...c };
  showForm.value = true;
}

function save() {
  if (!form.value.name) return alert("Name is required");

  if (form.value.id) {
    const i = customers.value.findIndex(x => x.id === form.value.id);
    customers.value[i] = { ...form.value };
  } else {
    form.value.id = Date.now();
    customers.value.push({ ...form.value });
  }
  showForm.value = false;
}

function remove(id) {
  customers.value = customers.value.filter(c => c.id !== id);
}

function cancel() {
  showForm.value = false;
}
</script>

<style scoped>
.page { padding: 20px; font-family: Arial; }

.top-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 8px; }
thead { background: #f5f5f5; }

.form-box {
  border: 1px solid #ddd;
  margin-top: 15px;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
}

.form-box input {
  display: block;
  margin-bottom: 8px;
  padding: 6px;
  width: 100%;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

/* Buttons */
.btn {
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
}

.add { background: #2ecc71; color: white; }
.edit { background: #3498db; color: white; margin-right: 6px; }
.delete { background: #e74c3c; color: white; }

.save { background: #2d8a4d; color: white; }
.cancel { background: #aaaaaa; color: white; }
</style>
