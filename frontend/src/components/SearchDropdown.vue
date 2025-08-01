<template>
  <div class="search-dropdown position-relative" @click="closeDropdown">
    <input
      type="search"
      class="form-control"
      placeholder="Search employees name ..."
      v-model="searchQuery"
      @focus="showDropdown = true"
      @input="showDropdown = true"
      @keydown.down.prevent="highlightNext"
      @keydown.up.prevent="highlightPrev"
      @keydown.enter.prevent="selectHighlighted"
      ref="searchInput"
      autocomplete="off"
    />
    <ul
      v-if="showDropdown && filteredEmployees.length"
      class="list-group position-absolute w-100"
      style="max-height: 200px; overflow-y: auto; z-index: 100;"
      ref="dropdownList"
    >
      <li
        v-for="(emp, index) in filteredEmployees"
        :key="emp.employeeId"
        class="list-group-item list-group-item-action"
        :class="{ active: highlightedIndex === index }"
        @mousedown.prevent="selectEmployee(emp)"
        @mouseover="highlightedIndex = index"
      >
        {{ emp.name }} (ID: {{ emp.employeeId }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchDropdown',
  props: {
    employees: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      highlightedIndex: -1
    };
  },
  computed: {
    filteredEmployees() {
      const query = this.searchQuery.toLowerCase().trim();
      return query
        ? this.employees.filter(emp => emp.name.toLowerCase().includes(query))
        : this.employees;
    }
  },
  methods: {
    highlightNext() {
      if (this.highlightedIndex < this.filteredEmployees.length - 1) {
        this.highlightedIndex++;
      }
    },
    highlightPrev() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      }
    },
    selectHighlighted() {
      if (this.highlightedIndex >= 0) {
        this.selectEmployee(this.filteredEmployees[this.highlightedIndex]);
      }
    },
    selectEmployee(emp) {
      this.$emit('select', emp);
      this.searchQuery = emp.name;
      this.showDropdown = false;
    },
    closeDropdown(event) {
      const input = this.$refs.searchInput;
      const list = this.$refs.dropdownList;
      if (!input?.contains(event.target) && !list?.contains(event.target)) {
        this.showDropdown = false;
        this.highlightedIndex = -1;
      }
    }
  }
};
</script>

<style scoped>
.list-group-item-action.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: white;
}
</style>