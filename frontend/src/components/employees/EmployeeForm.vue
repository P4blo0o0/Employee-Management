<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Personal Information -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Personal Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            v-model="formData.first_name"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            v-model="formData.last_name"
            type="text"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
          <input
            v-model="formData.middle_name"
            type="text"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            v-model="formData.date_of_birth"
            type="date"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select v-model="formData.gender" class="input-field">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          <select v-model="formData.marital_status" class="input-field">
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Contact Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            v-model="formData.email"
            type="email"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="input-field"
            placeholder="+639123456789"
          />
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            v-model="formData.address"
            type="text"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            v-model="formData.city"
            type="text"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
          <input
            v-model="formData.state"
            type="text"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Employment Information -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Employment Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select v-model="formData.department_id" class="input-field">
            <option value="">Select Department</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select v-model="formData.position_id" class="input-field">
            <option value="">Select Position</option>
            <option v-for="pos in positions" :key="pos.id" :value="pos.id">
              {{ pos.title }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
          <input
            v-model="formData.hire_date"
            type="date"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <select v-model="formData.employment_type" class="input-field">
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="probationary">Probationary</option>
            <option value="intern">Intern</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <input
            v-model="formData.salary"
            type="number"
            step="0.01"
            class="input-field"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>

    <!-- Government IDs (Philippines) -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Government IDs</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SSS Number</label>
          <input
            v-model="formData.sss_number"
            type="text"
            class="input-field"
            placeholder="XX-XXXXXXX-X"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">PhilHealth Number</label>
          <input
            v-model="formData.philhealth_number"
            type="text"
            class="input-field"
            placeholder="XX-XXXXXXXXX-X"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pag-IBIG Number</label>
          <input
            v-model="formData.pagibig_number"
            type="text"
            class="input-field"
            placeholder="XXXX-XXXX-XXXX"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
          <input
            v-model="formData.tin_number"
            type="text"
            class="input-field"
            placeholder="XXX-XXX-XXX-XXX"
          />
        </div>
      </div>
    </div>

    <!-- Emergency Contact -->
    <div class="card p-6">
      <h3 class="text-lg font-medium mb-4">Emergency Contact</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            v-model="formData.emergency_contact_name"
            type="text"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <input
            v-model="formData.emergency_contact_relationship"
            type="text"
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <input
            v-model="formData.emergency_contact_phone"
            type="tel"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn-primary"
      >
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import departmentService from '../../api/departmentService'
import positionService from '../../api/positionService'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  submitText: {
    type: String,
    default: 'Create Employee'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone: '',
  department_id: null,
  position_id: null,
  hire_date: '',
  employment_type: 'full-time',
  salary: null,
  date_of_birth: '',
  gender: '',
  marital_status: '',
  address: '',
  city: '',
  state: '',
  sss_number: '',
  philhealth_number: '',
  pagibig_number: '',
  tin_number: '',
  emergency_contact_name: '',
  emergency_contact_relationship: '',
  emergency_contact_phone: '',
  ...props.initialData
})

const departments = ref([])
const positions = ref([])

onMounted(async () => {
  try {
    const [deptResponse, posResponse] = await Promise.all([
      departmentService.getAll(),
      positionService.getAll()
    ])
    departments.value = deptResponse.data
    positions.value = posResponse.data
  } catch (error) {
    console.error('Failed to load form data:', error)
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}
</script>