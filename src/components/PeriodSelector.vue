<template>
  <div class="flex flex-wrap justify-start items-center gap-2">
    <Button
      :severity="selectedPeriod === 'now' ? 'primary' : 'secondary'"
      @click="handleDateSelected('now')"
      >Now</Button
    >
    <Button
      :severity="selectedPeriod === 'today' ? 'primary' : 'secondary'"
      @click="handleDateSelected('today')"
      >Today</Button
    >
    <FloatLabel variant="on">
      <DatePicker
        v-model="date as Date | null"
        inputId="select_date"
        showIcon
        iconDisplay="input"
        :minDate="minDate"
        :maxDate="maxDate"
        @value-change="handleDateSelected($event as Date | null)"
      />
      <label for="select_date">Select Date</label>
    </FloatLabel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import type { SelectedPeriod } from '@/types/selectedDate.types'

defineProps<{
  selectedPeriod: SelectedPeriod
}>()

const emit = defineEmits<{
  selectPeriod: [SelectedPeriod]
}>()

const date = ref<null | Date>(null)

const minDate = new Date()
const maxDate = new Date(new Date().setDate(new Date().getDate() + 6))

const handleDateSelected = (selectedDate: SelectedPeriod) => {
  if (selectedDate === 'now' || selectedDate === 'today') date.value = null
  emit('selectPeriod', selectedDate)
}
</script>

<style scoped>
:deep(.p-datepicker-input) {
  --p-inputtext-color: var(--p-button-primary-background);
}
</style>
