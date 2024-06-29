import { UserDetailsModel, UserGender, getUserDetails } from '@Common/api'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { Form } from 'antd'

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
  const { user } = useAuth()

  const [userDetails, setUserDetails] = useState<UserDetailsModel>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

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

  function handleFinish() {
    console.log('handleFinish')
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
    form,
    hasBeenUpdated,
    setInitialValues,
    isFormUpdated,
    handleFinish,
    handleDeleteAccount,
  }
}
