import { App, Form, UploadFile } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import { PostModel } from '@Common/api'
import { getPostImagesArray } from '@Posts/helpers'
import { RcFile } from 'antd/es/upload'
import { SERVER_URL } from 'constants'
import { PostCreateUpdateForm } from './PostCreateUpdateForm'
import { PostCreateUpdateModal } from './PostCreateUpdateModal'

type PostUpdateModalProps = {
  post: PostModel
  setPost: React.Dispatch<React.SetStateAction<PostModel | null>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function PostUpdateModal({
  post,
  setPost,
  isOpen,
  setIsOpen,
}: PostUpdateModalProps) {
  const { notification } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm<PostCreateUpdateForm>()
  const [files, setFiles] = useState<RcFile[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [initialFormValues, setInitialFormValues] = useState<{
    form: PostCreateUpdateForm
    files: RcFile[]
    fileList: UploadFile[]
  }>()
  const [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false)

  async function handleFinish(formData: FormData) {
    setIsLoading(true)

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
    setIsLoading(false)
  }

  const loadInitialValues = useCallback(async () => {
    const postImages = getPostImagesArray(post)

    const initialFormValues: PostCreateUpdateForm = {
      name: post.name,
      description: post.description,
      value: post.value,
      stock_product: post.stock_product,
      state_product: post.state_product,
      category: post.category.active ? post.category.id.toString() : '',
      subsidiary: post.subsidiary.active ? post.subsidiary.id.toString() : '',
    }

    const initialImageFiles: RcFile[] = await Promise.all(
      postImages.map(async (imageUrl, i) => {
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

    const initialFileList: UploadFile[] = postImages.map((imageUrl, i) => ({
      name: `Imagen ${i + 1}${imageUrl.split('.').pop()}`,
      uid: i.toString(),
      url: imageUrl,
    }))

    form.setFieldsValue(initialFormValues)
    setFiles(initialImageFiles)
    setFileList(initialFileList)

    setInitialFormValues({
      form: initialFormValues,
      files: initialImageFiles,
      fileList: initialFileList,
    })
  }, [form, post])

  const checkIfUpdated = (values: PostCreateUpdateForm): boolean => {
    const initialValues = initialFormValues!.form

    // Comparar campos del formulario individualmente
    const formUpdated =
      initialValues.name !== values.name ||
      initialValues.description.replace(/\r\n/g, '\n') !==
        values.description.replace(/\r\n/g, '\n') ||
      initialValues.value !== values.value ||
      initialValues.stock_product !== values.stock_product ||
      initialValues.state_product !== values.state_product ||
      initialValues.category !== values.category ||
      initialValues.subsidiary !== values.subsidiary

    const filesUpdated =
      JSON.stringify(initialFormValues!.files) !== JSON.stringify(files)

    const result = formUpdated || filesUpdated
    setHasBeenUpdated(result)
    return result
  }

  function handleCancel() {
    setIsOpen(false)
    form.setFieldsValue(initialFormValues!.form)
    setFiles(initialFormValues!.files)
    setFileList(initialFormValues!.fileList)
    form.validateFields()
    setHasBeenUpdated(false)
  }

  // Cargar formulario con los datos actuales
  useEffect(() => {
    loadInitialValues()
  }, [loadInitialValues])

  return (
    <PostCreateUpdateModal
      title="Editar publicación"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoading={isLoading}
      okText="Editar"
      form={form}
      files={files}
      setFiles={setFiles}
      fileList={fileList}
      setFileList={setFileList}
      handleFinish={handleFinish}
      modalProps={{
        okButtonProps: { disabled: !hasBeenUpdated },
        cancelButtonProps: { onClick: handleCancel },
      }}
      formProps={{
        onValuesChange: (_changedValues, values) => checkIfUpdated(values),
      }}
    />
  )
}
