import { defineRule } from 'vee-validate'

export default defineNuxtPlugin(() => {
  defineRule('required', (value: string | number | any[]) => {
    if (
      (typeof value === 'string' && !value.length) ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length <= 0)
    ) {
      return 'Trường này bắt buộc'
    }
    return true
  })

  defineRule('email', (value: string) => {
    // Field is empty, should pass
    if (!value || !value.length) {
      return true
    }
    // Check if email
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      return 'Trường này phải là email'
    }
    return true
  })

  defineRule('length', (value: string, [length]: [number]) => {
    // The field is empty so it should pass
    if (!value || !value.length) {
      return true
    }
    if (value.length != length) {
      return `Trường này phải có ${length} ký tự`
    }
    return true
  })

  defineRule('minLength', (value: string, [limit]: [number]) => {
    // The field is empty so it should pass
    if (!value || !value.length) {
      return true
    }
    if (value.length < limit) {
      return `Tối thiểu ${limit} ký tự`
    }
    return true
  })

  defineRule('maxLength', (value: string, [limit]: [number]) => {
    if (value.length > limit) {
      return `Trường này tối đa ${limit} ký tự`
    }
    return true
  })

  defineRule('confirmed', (value: string, [target]: [string], ctx) => {
    if (value === ctx.form[target]) {
      return true
    }
    return 'Xác nhận không trùng khớp'
  })
})
