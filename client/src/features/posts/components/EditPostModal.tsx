import { App, Form, Modal, UploadFile } from 'antd'
import { useEffect, useState } from 'react'

import { useAuth } from '@Common/hooks'
import { PostModel } from '@Common/api'
import { getPostImagesArray } from '@Posts/helpers'
import { RcFile } from 'antd/es/upload'
import { SERVER_URL } from 'constants'
import { PostCreateUpdateForm } from './PostCreateUpdate/PostCreateUpdateForm'

type EditPostModalProps = {
  post: PostModel
  setPost: React.Dispatch<React.SetStateAction<PostModel | null>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditPostModal({
  post,
  setPost,
  isOpen,
  setIsOpen,
}: EditPostModalProps) {
  const { user } = useAuth()
  const { notification } = App.useApp()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [form] = Form.useForm<PostCreateUpdateForm>()
  const [files, setFiles] = useState<RcFile[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleFinish = async (values: PostCreateUpdateForm) => {
    setConfirmLoading(true)

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('value', values.value.toString())
    formData.append('user', user!.id.toString())
    formData.append('subsidiary', values.subsidiary)
    formData.append('state', '2')
    formData.append('category', values.category)
    formData.append('state_product', values.state_product)
    formData.append('stock_product', values.stock_product.toString())

    // Add files to formData
    files.forEach((file, index) => {
      formData.append(`image_${index + 1}`, file, file.name)
    })

    // Fill the rest of image fields with null
    for (let i = files.length; i < 5; i++) {
      formData.append(`image_${i + 1}`, '')
    }

    const resp = await fetch(`${SERVER_URL}/post/update/${post.id}/`, {
      method: 'PATCH',
      body: formData,
    })

    const data = await resp.json()

    if (resp.ok && data.ok) {
      setPost(data.data.post)
      notification.success({
        message: 'Publicación editada correctamente',
        description: 'Se ha editado la publicación.',
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
      setIsOpen(false)
    } else {
      notification.error({
        message: 'Ocurrió un error al editar la publicación',
        description:
          'Lo sentimos! No pudimos editar la publicación debido a un error inesperado. Inténtalo más tarde.',
        placement: 'topRight',
        duration: 3,
      })
    }
    setConfirmLoading(false)
  }

  // Cargar formulario con los datos actuales
  useEffect(() => {
    ;(async () => {
      setFileList(
        getPostImagesArray(post).map((imageUrl, i) => ({
          name: `Imagen ${i + 1}`,
          uid: i.toString(),
          url: imageUrl,
        }))
      )

      const imageFiles: RcFile[] = await Promise.all(
        getPostImagesArray(post).map(async (imageUrl, i) => {
          const resp = await fetch(imageUrl)
          const blob = await resp.blob()

          const file: RcFile = new File(
            [blob],
            `Imagen_${i + 1}.${blob.type.split('/')[1]}`,
            { type: blob.type }
          ) as RcFile
          file.uid = i.toString()
          return file
        })
      )

      setFiles(imageFiles)
    })()

    form.setFieldsValue({
      name: post.name,
      description: post.description,
      value: post.value,
      stock_product: post.stock_product,
      state_product: post.state_product,
      category: post.category.active ? post.category.id.toString() : '',
      subsidiary: post.subsidiary.active ? post.subsidiary.id.toString() : '',
    })
  }, [form, post])

  return (
    <Modal
      title="Editar publicación"
      open={isOpen}
      onOk={form.submit}
      onCancel={() => setIsOpen(false)}
      confirmLoading={confirmLoading}
      okText="Editar"
      cancelText="Cancelar"
    >
      <PostCreateUpdateForm
        form={form}
        files={files}
        setFiles={setFiles}
        fileList={fileList}
        setFileList={setFileList}
        handleFinish={handleFinish}
        isLoading={confirmLoading}
      />
    </Modal>
  )
}
