import { FormInstance, FormProps, Modal, ModalProps } from 'antd'
import { PostCreateUpdateForm } from './PostCreateUpdateForm'
import { RcFile, UploadFile } from 'antd/es/upload'
import { useAuth } from '@Common/hooks'

type PostCreateUpdateModalProps = {
  title: string
  okText: string
  form: FormInstance<PostCreateUpdateForm>
  files: RcFile[]
  setFiles: React.Dispatch<React.SetStateAction<RcFile[]>>
  fileList: UploadFile[]
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  handleFinish: (formData: FormData) => void
  isLoading: boolean
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  modalProps?: ModalProps
  formProps?: FormProps
}

export function PostCreateUpdateModal({
  title,
  okText,
  form,
  files,
  setFiles,
  fileList,
  setFileList,
  handleFinish,
  isLoading,
  isOpen,
  setIsOpen,
  modalProps,
  formProps,
}: PostCreateUpdateModalProps) {
  const { user } = useAuth()

  function onFinish(values: PostCreateUpdateForm) {
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

    // Fill the rest of image fields with an empty value
    for (let i = files.length; i < 5; i++) {
      formData.append(`image_${i + 1}`, '')
    }

    handleFinish(formData)
  }

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={form.submit}
      onCancel={() => setIsOpen(false)}
      confirmLoading={isLoading}
      okText={okText}
      cancelText="Cancelar"
      forceRender
      {...modalProps}
    >
      <PostCreateUpdateForm
        form={form}
        files={files}
        setFiles={setFiles}
        fileList={fileList}
        setFileList={setFileList}
        handleFinish={onFinish}
        isLoading={isLoading}
        formProps={formProps}
      />
    </Modal>
  )
}
