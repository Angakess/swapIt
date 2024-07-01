import {
  EditUserProfileOptions,
  UserDetailsModel,
  UserGender,
  editUserProfile,
  getUserDetails,
} from '@Common/api'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { Form } from 'antd'
import { useCustomAlerts } from './useCustomAlerts'

export type EditFormData = {
  email: string
  phone_number: string
  date_of_birth: Dayjs
  gender: UserGender
  password: string
  confirmPassword: string
  currentPassword: string
}

export function useEditProfileForm() {
  const { user, updateEmail } = useAuth()
  const { successNotification } = useCustomAlerts()

  const [userDetails, setUserDetails] = useState<UserDetailsModel>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [invalidPasswordValidation, setInvalidPasswordValidation] =
    useState(false)

  const [form] = Form.useForm<EditFormData>()
  const [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false)

  const setInitialValues = useCallback(() => {
    form.setFieldsValue({
      email: userDetails!.email,
      phone_number: userDetails!.phone_number,
      date_of_birth: dayjs(userDetails!.date_of_birth),
      gender: userDetails!.gender,
      password: '',
      confirmPassword: '',
      currentPassword: '',
    })
    setHasBeenUpdated(false)
  }, [form, userDetails])

  function isFormUpdated(values: EditFormData): boolean {
    const result =
      values.email !== userDetails!.email ||
      values.phone_number !== userDetails!.phone_number ||
      values.date_of_birth.format('YYYY-MM-DD') !==
        userDetails!.date_of_birth ||
      values.gender !== userDetails!.gender ||
      values.password !== '' ||
      values.confirmPassword !== ''

    setHasBeenUpdated(result)
    return result
  }

  async function handleFinish(values: EditFormData) {
    setIsUpdating(true)

    // Crear el objeto con la nueva información:
    const newUserData: EditUserProfileOptions = {
      id: user!.id,
      current_password: values.currentPassword,

      email: values.email,
      phone_number: values.phone_number,
      date_of_birth: values.date_of_birth.format('YYYY-MM-DD'),
      gender: values.gender,
    }

    // Si se ingresó una nueva contraseña, agregarla
    if (values.password !== '') {
      newUserData.new_password = values.password
    }

    // Solicitar la actualización
    const resp = await editUserProfile(newUserData)

    if (resp.ok) {
      // Se actualizó la información del usuario
      if (user!.email !== resp.data.user.email) {
        // actualizar el correo solo si cambió
        updateEmail(resp.data.user.email)
      }
      setUserDetails(resp.data.user)
      setHasBeenUpdated(false)
      successNotification(
        'Información actualizada',
        'Tu información ha sido actualizada correctamente.'
      )
    } else {
      // No se actualizó la información del usuario.
      // La contraseña es incorrecta.
      setInvalidPasswordValidation(true)
    }

    setIsUpdating(false)
  }

  function handleDeleteAccount() {
    console.log('handleDeleteAccount')
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      setUserDetails((await getUserDetails(user!.id))!)
      setIsLoading(false)
    })()
  }, [user])

  useEffect(() => {
    if (!isLoading) setInitialValues()
  }, [isLoading, setInitialValues])

  return {
    userDetails,
    isLoading,
    isUpdating,
    form,
    hasBeenUpdated,
    setInitialValues,
    isFormUpdated,
    handleFinish,
    handleDeleteAccount,
    invalidPasswordValidation,
    setInvalidPasswordValidation,
  }
}
