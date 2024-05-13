import { RuleObject } from 'antd/es/form'

export function dniValidator(_: RuleObject, value: number) {
  if (!value || value.toString().length == 8) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('El DNI debe ser un número de 8 dígitos'))
}

export function phoneValidator(_: RuleObject, value: string) {
  if (!value || /^\d+$/.test(value)) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('Debe ingresar un número'))
}

export function dateValidator(_: RuleObject, value: any) {
  if (value != undefined || value != null) {
    const today = new Date()
    const bDay = value.$d
    let age = today.getFullYear() - bDay.getFullYear()
    const m = today.getMonth() - bDay.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < bDay.getDate())) {
      age--
    }
    if (!value || age >= 18) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Debe tener mas de 18 años'))
  }
  return Promise.resolve()
}

export function codeValidator(_: RuleObject, value: any) {
  const format = /[`!@#$%^()_+\-=\[\]{};':"\\|,.<>\/?~]/
  if (!value || !format.test(value)) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('Hay uno o más caracteres inválidos'))
}
