<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">Hotel Booking — One Page</h1>
        <div class="text-sm text-gray-600">Bookings stored in <code>localStorage</code></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left: Booking Form + Availability -->
        <section class="lg:col-span-1 bg-white p-6 rounded-xl shadow">
          <h2 class="text-lg font-semibold mb-4">New Booking</h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">

            <div>
              <label class="block text-sm font-medium text-gray-700">Full name</label>
              <input v-model="form.fullName" required class="mt-1 w-full p-2 border rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email" required class="mt-1 w-full p-2 border rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input v-model="form.phone" required class="mt-1 w-full p-2 border rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Room type</label>
              <select v-model="form.roomType" required class="mt-1 w-full p-2 border rounded">
                <option value="">Select room type</option>
                <option v-for="(r, key) in roomTypes" :key="key" :value="key">
                  {{ r.label }} — {{ formatCurrency(r.price) }} / night ({{ r.count }} rooms)
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Check-in</label>
                <input v-model="form.checkIn" type="date" required class="mt-1 w-full p-2 border rounded" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Check-out</label>
                <input v-model="form.checkOut" type="date" required class="mt-1 w-full p-2 border rounded" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Guests</label>
              <input v-model.number="form.guests" type="number" min="1" class="mt-1 w-full p-2 border rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Special requests</label>
              <textarea v-model="form.special" rows="2" class="mt-1 w-full p-2 border rounded"></textarea>
            </div>

            <!-- Availability check feedback -->
            <div v-if="availabilityMessage" :class="availabilityOk ? 'text-green-700' : 'text-red-700'">
              {{ availabilityMessage }}
            </div>

            <div class="flex items-center gap-2">
              <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Book (check availability)
              </button>

              <button type="button" @click="openCalendarFor = 'range'"
                class="px-3 py-2 border rounded text-sm">Open calendar</button>
            </div>
          </form>

          <!-- Price preview -->
          <div class="mt-4 border-t pt-4 text-sm text-gray-700">
            <div><strong>Nights:</strong> {{ computedNights }}</div>
            <div><strong>Price / night:</strong> {{ selectedRoomPriceDisplay }}</div>
            <div class="mt-2 text-lg font-semibold">
              Total estimate: {{ formatCurrency(estimatedTotal) }}
            </div>
          </div>
        </section>

        <!-- Middle: Calendar + Availability Viewer -->
        <section class="lg:col-span-1 bg-white p-6 rounded-xl shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Calendar</h2>
            <div class="text-sm text-gray-600">Click date → populates Check-in / Check-out</div>
          </div>

          <!-- Calendar controls -->
          <div class="flex items-center gap-2 mb-4">
            <button @click="prevMonth" class="px-2 py-1 border rounded">◀</button>
            <div class="font-medium">{{ calendarMonthYear }}</div>
            <button @click="nextMonth" class="px-2 py-1 border rounded">▶</button>

            <div class="ml-auto flex items-center gap-2">
              <label class="text-sm">Mode:</label>
              <select v-model="calendarMode" class="p-1 border rounded text-sm">
                <option value="select">Select date</option>
                <option value="range">Select range</option>
              </select>
            </div>
          </div>

          <!-- Calendar grid -->
          <div class="grid grid-cols-7 gap-1 text-sm">
            <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d"
                 class="text-center font-medium text-gray-500">{{ d }}</div>

            <div v-for="(day, idx) in calendarDays" :key="idx"
                 :class="dayClass(day)"
                 @click="onCalendarClick(day)"
                 class="cursor-pointer select-none p-2 rounded text-center">
              <div>{{ day.date.getDate() }}</div>
              <div class="text-xs mt-1">
                <span v-if="availabilityBadge(day)" class="px-1 rounded text-[11px]">{{ availabilityBadge(day) }}</span>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="mt-4 text-xs text-gray-600">
            <div class="flex items-center gap-2"><span class="w-3 h-3 bg-green-300 rounded"></span> Available</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 bg-red-300 rounded"></span> Fully booked</div>
            <div class="mt-2 text-xs">Tip: Choose room type in the form to see availability badges on calendar.</div>
          </div>
        </section>

        <!-- Right: Payment & Bookings table -->
        <section class="lg:col-span-1 space-y-6">

          <!-- Payment Panel -->
          <div class="bg-white p-6 rounded-xl shadow">
            <h2 class="text-lg font-semibold mb-4">Payment (simulate)</h2>
            <div class="text-sm text-gray-600 mb-3">Select an unpaid booking from the list and simulate payment here.</div>

            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700">Select booking</label>
              <select v-model="selectedBookingId" class="mt-1 w-full p-2 border rounded">
                <option value="">Choose booking</option>
                <option v-for="b in unpaidBookings" :key="b.id" :value="b.id">
                  #{{ b.id }} — {{ b.fullName }} ({{ b.roomType }}) {{ b.checkIn }} → {{ b.checkOut }} — {{ formatCurrency(b.total) }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Card holder</label>
              <input v-model="payment.cardName" class="mt-1 w-full p-2 border rounded" placeholder="Name on card" />
            </div>

            <div class="grid grid-cols-3 gap-2 mt-2">
              <input v-model="payment.cardNumber" class="col-span-2 p-2 border rounded" placeholder="Card number" />
              <input v-model="payment.exp" class="p-2 border rounded" placeholder="MM/YY" />
            </div>

            <div class="mt-3">
              <button @click="processPayment" :disabled="!selectedBookingId" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Pay Now (simulate)
              </button>
            </div>

            <div v-if="paymentMessage" class="mt-3 text-sm" :class="paymentOk ? 'text-green-700' : 'text-red-700'">
              {{ paymentMessage }}
            </div>
          </div>

          <!-- Bookings table -->
          <div class="bg-white p-4 rounded-xl shadow overflow-x-auto">
            <h2 class="text-lg font-semibold mb-3">Bookings</h2>

            <table class="min-w-full text-sm">
              <thead class="text-left text-xs text-gray-500">
                <tr>
                  <th class="p-2">#</th>
                  <th class="p-2">Guest</th>
                  <th class="p-2">Room</th>
                  <th class="p-2">Dates</th>
                  <th class="p-2">Nights</th>
                  <th class="p-2">Total</th>
                  <th class="p-2">Status</th>
                  <th class="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in bookingsSorted" :key="b.id" class="border-t">
                  <td class="p-2 align-top">#{{ b.id }}</td>
                  <td class="p-2 align-top">{{ b.fullName }}<div class="text-xs text-gray-500">{{ b.email }}</div></td>
                  <td class="p-2 align-top">{{ b.roomType }}</td>
                  <td class="p-2 align-top">{{ b.checkIn }} → {{ b.checkOut }}</td>
                  <td class="p-2 align-top">{{ nightsBetween(b.checkIn, b.checkOut) }}</td>
                  <td class="p-2 align-top">{{ formatCurrency(b.total) }}</td>
                  <td class="p-2 align-top">
                    <span :class="b.paid ? 'text-green-700' : 'text-yellow-700'">{{ b.paid ? 'Paid' : 'Unpaid' }}</span>
                  </td>
                  <td class="p-2 align-top space-x-2">
                    <button v-if="!b.paid" @click="quickSelectForPayment(b.id)" class="px-2 py-1 bg-indigo-600 text-white rounded text-xs">Pay</button>
                    <button @click="cancelBooking(b.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">Cancel</button>
                  </td>
                </tr>

                <tr v-if="bookings.length === 0">
                  <td class="p-4 text-center text-gray-500" colspan="8">No bookings yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "BookingPage",
  data() {
    return {
      // Room types / inventory
      roomTypes: {
        Single: { label: "Single", price: 30, count: 5 },
        Double: { label: "Double", price: 50, count: 6 },
        Deluxe: { label: "Deluxe", price: 90, count: 3 },
        Suite: { label: "Suite", price: 150, count: 2 },
      },

      // Booking form
      form: {
        fullName: "",
        email: "",
        phone: "",
        roomType: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        special: "",
      },

      // Bookings list
      bookings: [],

      // Calendar state
      calYear: new Date().getFullYear(),
      calMonth: new Date().getMonth(), // 0-index
      calendarMode: "select", // or 'range'
      openCalendarFor: null, // 'range' if user requested calendar

      // Payment state
      selectedBookingId: "",
      payment: { cardName: "", cardNumber: "", exp: "" },
      paymentMessage: "",
      paymentOk: false,

      // UI messages
      availabilityMessage: "",
      availabilityOk: false,
    };
  },

  created() {
    this.loadBookings();
  },

  computed: {
    // calendar display
    calendarMonthYear() {
      const d = new Date(this.calYear, this.calMonth);
      return d.toLocaleString(undefined, { month: "long", year: "numeric" });
    },

    calendarDays() {
      // produce array of day objects for current month view including leading blanks
      const first = new Date(this.calYear, this.calMonth, 1);
      const startWeekday = first.getDay(); // 0..6
      const daysInMonth = new Date(this.calYear, this.calMonth + 1, 0).getDate();

      // include previous month's tail to fill first week
      const arr = [];
      for (let i = 0; i < startWeekday; i++) {
        arr.push({ date: new Date(this.calYear, this.calMonth, i - startWeekday + 1 - 0), inactive: true });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        arr.push({ date: new Date(this.calYear, this.calMonth, d), inactive: false });
      }

      // pad to full weeks
      while (arr.length % 7 !== 0) {
        const lastDate = arr[arr.length - 1].date;
        arr.push({ date: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1), inactive: true });
      }
      return arr;
    },

    // nights computed from form
    computedNights() {
      return this.nightsBetween(this.form.checkIn, this.form.checkOut);
    },

    selectedRoomPriceDisplay() {
      return this.form.roomType ? this.formatCurrency(this.roomTypes[this.form.roomType].price) : "-";
    },

    estimatedTotal() {
      if (!this.form.roomType || !this.form.checkIn || !this.form.checkOut) return 0;
      return this.nightsBetween(this.form.checkIn, this.form.checkOut) * this.roomTypes[this.form.roomType].price;
    },

    unpaidBookings() {
      return this.bookings.filter(b => !b.paid).sort((a,b)=>b.id-a.id);
    },

    bookingsSorted() {
      return [...this.bookings].sort((a, b) => b.id - a.id);
    },

    availabilityOk() {
      return this.availabilityOk;
    }
  },

  methods: {
    // ---------- storage ----------
    loadBookings() {
      try {
        const raw = localStorage.getItem("hotel_bookings_v1");
        this.bookings = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error("load error", e);
        this.bookings = [];
      }
    },

    saveBookings() {
      localStorage.setItem("hotel_bookings_v1", JSON.stringify(this.bookings));
    },

    // ---------- helpers ----------
    formatCurrency(v) {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
    },

    nightsBetween(a, b) {
      if (!a || !b) return 0;
      const da = new Date(a + "T00:00:00");
      const db = new Date(b + "T00:00:00");
      const diff = (db - da) / (1000 * 60 * 60 * 24);
      return diff > 0 ? diff : 0;
    },

    nextMonth() {
      this.calMonth++;
      if (this.calMonth > 11) { this.calMonth = 0; this.calYear++; }
    },
    prevMonth() {
      this.calMonth--;
      if (this.calMonth < 0) { this.calMonth = 11; this.calYear--; }
    },

    dayClass(day) {
      const base = "rounded";
      if (day.inactive) return base + " text-gray-300";
      const isToday = this.isSameDay(day.date, new Date());
      const selectedIn = this.form.checkIn ? new Date(this.form.checkIn) : null;
      const selectedOut = this.form.checkOut ? new Date(this.form.checkOut) : null;
      const inRange = selectedIn && selectedOut && (day.date >= selectedIn && day.date <= selectedOut);
      const fullyBooked = this.isFullyBooked(day.date);
      return [
        base,
        isToday ? "border border-blue-300" : "",
        inRange ? "bg-blue-100" : "",
        fullyBooked ? "bg-red-200 text-red-800" : "bg-green-100 text-green-800",
      ].join(" ");
    },

    isSameDay(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    },

    // ---------- availability ----------
    // Returns how many rooms are free for given roomType on a single date
    freeRoomsOn(roomType, date) {
      if (!roomType) return 0;
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 1000 * 60 * 60 * 24);

      // count overlapping bookings for that roomType
      let occupied = 0;
      for (const b of this.bookings) {
        if (b.roomType !== roomType) continue;
        // booking occupies nights from checkIn (inclusive) to checkOut (exclusive)
        const bi = new Date(b.checkIn + "T00:00:00");
        const bo = new Date(b.checkOut + "T00:00:00");
        if (bi < dayEnd && bo > dayStart) occupied++;
      }
      return Math.max(0, this.roomTypes[roomType].count - occupied);
    },

    // For calendar small badge
    availabilityBadge(dayObj) {
      if (!this.form.roomType) return "";
      if (dayObj.inactive) return "";
      const free = this.freeRoomsOn(this.form.roomType, dayObj.date);
      return free > 0 ? `${free} left` : "full";
    },

    isFullyBooked(date) {
      if (!this.form.roomType) return false;
      return this.freeRoomsOn(this.form.roomType, date) <= 0;
    },

    // Check availability across date range for selected room type
    checkAvailabilityForRange(roomType, checkIn, checkOut) {
      if (!roomType || !checkIn || !checkOut) {
        this.availabilityMessage = "";
        this.availabilityOk = false;
        return false;
      }
      const start = new Date(checkIn + "T00:00:00");
      const end = new Date(checkOut + "T00:00:00");
      if (end <= start) {
        this.availabilityMessage = "Check-out must be after check-in.";
        this.availabilityOk = false;
        return false;
      }
      // iterate dates from start (inclusive) to end-1
      const days = [];
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      for (const dt of days) {
        if (this.freeRoomsOn(roomType, dt) <= 0) {
          this.availabilityMessage = `No availability for ${roomType} on ${dt.toISOString().slice(0,10)}.`;
          this.availabilityOk = false;
          return false;
        }
      }
      this.availabilityMessage = `Rooms are available for ${roomType} for those dates.`;
      this.availabilityOk = true;
      return true;
    },

    // ---------- calendar click handler ----------
    onCalendarClick(dayObj) {
      if (dayObj.inactive) return;
      const str = dayObj.date.toISOString().slice(0,10);
      if (this.calendarMode === "select") {
        // fill checkIn or checkOut depending on which is empty or which is active
        if (!this.form.checkIn || (this.form.checkIn && this.form.checkOut)) {
          this.form.checkIn = str;
          this.form.checkOut = "";
        } else {
          // set checkOut if after checkIn, otherwise replace checkIn
          const inDate = new Date(this.form.checkIn + "T00:00:00");
          const clicked = dayObj.date;
          if (clicked > inDate) {
            this.form.checkOut = str;
          } else {
            // clicked earlier -> set new checkIn
            this.form.checkIn = str;
            this.form.checkOut = "";
          }
        }
      } else if (this.calendarMode === "range") {
        // Range mode: first click sets checkIn, second sets checkOut if after
        if (!this.form.checkIn || (this.form.checkIn && this.form.checkOut)) {
          this.form.checkIn = str;
          this.form.checkOut = "";
        } else {
          // second click
          const inD = new Date(this.form.checkIn + "T00:00:00");
          const clicked = dayObj.date;
          if (clicked > inD) this.form.checkOut = str;
          else {
            // swap: make clicked checkIn, old becomes checkOut
            this.form.checkOut = this.form.checkIn;
            this.form.checkIn = str;
          }
        }
      }
      // perform availability hint
      this.checkAvailabilityForRange(this.form.roomType, this.form.checkIn, this.form.checkOut);
    },

    // ---------- booking submit ----------
    handleSubmit() {
      // basic validation
      if (!this.form.fullName || !this.form.email || !this.form.roomType || !this.form.checkIn || !this.form.checkOut) {
        alert("Please fill required fields.");
        return;
      }

      // availability
      const ok = this.checkAvailabilityForRange(this.form.roomType, this.form.checkIn, this.form.checkOut);
      if (!ok) return;

      // create booking
      const nights = this.nightsBetween(this.form.checkIn, this.form.checkOut);
      const price = this.roomTypes[this.form.roomType].price;
      const total = nights * price;
      const id = (this.bookings.length ? Math.max(...this.bookings.map(b=>b.id)) : 0) + 1;
      const booking = {
        id,
        fullName: this.form.fullName,
        email: this.form.email,
        phone: this.form.phone,
        roomType: this.form.roomType,
        checkIn: this.form.checkIn,
        checkOut: this.form.checkOut,
        guests: this.form.guests,
        special: this.form.special,
        total,
        paid: false,
        createdAt: new Date().toISOString(),
      };
      this.bookings.push(booking);
      this.saveBookings();

      // feedback + reset partial form
      this.availabilityMessage = `Booking #${id} created. Please pay to confirm.`;
      this.availabilityOk = true;

      // reset form for new booking except keep roomType for convenience
      const keepRoom = this.form.roomType;
      this.form = {
        fullName: "",
        email: "",
        phone: "",
        roomType: keepRoom,
        checkIn: "",
        checkOut: "",
        guests: 1,
        special: "",
      };

      // open table to show new booking (UX)
      this.selectedBookingId = id;
    },

    // cancel booking
    cancelBooking(id) {
      if (!confirm("Cancel booking? This will remove it.")) return;
      this.bookings = this.bookings.filter(b => b.id !== id);
      this.saveBookings();
      if (this.selectedBookingId === id) this.selectedBookingId = "";
    },

    // ---------- payment simulation ----------
    quickSelectForPayment(id) {
      this.selectedBookingId = id;
      // scroll or focus not implemented — user will see selection change
    },

    processPayment() {
      this.paymentMessage = "";
      this.paymentOk = false;
      const booking = this.bookings.find(b => b.id === Number(this.selectedBookingId));
      if (!booking) {
        this.paymentMessage = "Select a valid booking.";
        return;
      }
      // basic mock validation
      if (!this.payment.cardName || !this.payment.cardNumber || !this.payment.exp) {
        this.paymentMessage = "Complete card details (simulated).";
        return;
      }
      // simulate success
      booking.paid = true;
      booking.paidAt = new Date().toISOString();
      this.saveBookings();
      this.paymentMessage = `Payment success for booking #${booking.id}.`;
      this.paymentOk = true;

      // clear payment fields a little
      this.payment = { cardName: "", cardNumber: "", exp: "" };
      // clear selected booking if desired
      this.selectedBookingId = "";
    },
  },
};
</script>

<style scoped>

</style>
