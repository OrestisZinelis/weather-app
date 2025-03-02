import { ref } from 'vue'

export default function useDebouncedLoading(delay = 300) {
  const isLoading = ref(false)
  const showSpinner = ref(false)
  let timer: ReturnType<typeof setTimeout>

  const startLoading = () => {
    isLoading.value = true
    timer = setTimeout(() => {
      if (isLoading.value) showSpinner.value = true
    }, delay)
  }

  const stopLoading = () => {
    isLoading.value = false
    clearTimeout(timer)
    showSpinner.value = false
  }

  return { isLoading, showSpinner, startLoading, stopLoading }
}
