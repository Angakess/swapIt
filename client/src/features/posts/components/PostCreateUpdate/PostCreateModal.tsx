import { useState } from 'react'
import { App, Form } from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload'

import { PostCreateUpdateModal } from './PostCreateUpdateModal'
import { PostCreateUpdateForm } from './PostCreateUpdateForm'

type PostCreateModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setHaveNewPosts: React.Dispatch<React.SetStateAction<boolean>>
}

export function PostCreateModal({
  isOpen,
  setIsOpen,
  setHaveNewPosts,
}: PostCreateModalProps) {
  const { notification } = App.useApp()

  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm<PostCreateUpdateForm>()
  const [files, setFiles] = useState<RcFile[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])

  async function handleFinish(formData: FormData) {
    setIsLoading(true)

    const resp = await fetch('http://localhost:8000/post/', {
      method: 'POST',
      body: formData,
    })

    const data = await resp.json()

    if (resp.ok && data.ok) {
      setHaveNewPosts(true)
      form.resetFields()
      notification.success({
        message: 'Publicación agregada correctamente',
        description: 'Se ha agregado la publicación',
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
      setIsOpen(false)
    } else {
      notification.error({
        message: 'Ocurrió un error al crear la publicación',
        description:
          'Lo sentimos! No pudimos crear la publicación debido a un error inesperado. Inténtalo más tarde',
        placement: 'topRight',
        duration: 3,
      })
    }
    setIsLoading(false)
  }

  return (
    <PostCreateUpdateModal
      title="Agregar publicación"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoading={isLoading}
      okText="Agregar"
      form={form}
      files={files}
      setFiles={setFiles}
      fileList={fileList}
      setFileList={setFileList}
      handleFinish={handleFinish}
    />
  )
}
