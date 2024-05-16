import { useAuth } from '@Common/hooks'
import {
  getCategoryList,
  getSubsidiaries,
} from '@Posts/helpers/getPostsListsExchanger'
import { UploadOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
} from 'antd'
import { useEffect, useState } from 'react'

type AddPostModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setHaveNewPosts: React.Dispatch<React.SetStateAction<boolean>>
}

type SelectOption = {
  label: string
  value: string
}

type AddPostForm = {
  category: string
  description: string
  images: { file: File; fileList: File[] }
  name: string
  state_product: string
  stock_product: number
  subsidiary: string
  value: number
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }))
}

async function mapSubsidiariesToSelectOption(): Promise<SelectOption[]> {
  const subsidiaries = await getSubsidiaries()
  return subsidiaries.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }))
}

export default function AddPostModal({
  isOpen,
  setIsOpen,
  setHaveNewPosts,
}: AddPostModalProps) {
  const { user } = useAuth()
  const { notification } = App.useApp()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([])
  const [subsidiaryOptions, setSubsidiaryOptions] = useState<SelectOption[]>([])

  const [files, setFiles] = useState<UploadFile[]>([])
  const [form] = Form.useForm<AddPostForm>()

  const handleFinish = async (values: AddPostForm) => {
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
    files.forEach((file, index) => {
      formData.append(`image_${index + 1}`, file)
    })

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
    setConfirmLoading(false)
  }

  // Cargar datos en los select
  useEffect(() => {
    mapCategoiresToSelectOptions().then(setCategoriesOptions)
    mapSubsidiariesToSelectOption().then(setSubsidiaryOptions)
  }, [])

  return (
    <Modal
      title="Agregar publicación"
      open={isOpen}
      onOk={form.submit}
      onCancel={() => setIsOpen(false)}
      confirmLoading={confirmLoading}
    >
      <Form
        layout="vertical"
        style={{ marginTop: '1.25rem' }}
        form={form}
        onFinish={handleFinish}
        disabled={confirmLoading}
      >
        <Form.Item
          label="Nombre"
          name="name"
          required={false}
          rules={[
            { required: true, message: 'Ingrese el nombre del producto' },
          ]}
        >
          <Input placeholder="Nombre del producto" size="large" autoFocus />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          required={false}
          rules={[{ required: true, message: 'Ingrese una descripción' }]}
        >
          <Input.TextArea
            placeholder="Descripción"
            size="large"
            autoSize={{ minRows: 3, maxRows: 10 }}
          />
        </Form.Item>

        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}>
            <Form.Item
              label="Valor"
              name="value"
              required={false}
              rules={[{ required: true, message: 'Ingrese un valor' }]}
            >
              <Select
                options={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              ></Select>
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item
              label="Cantidad"
              name="stock_product"
              required={false}
              rules={[
                {
                  required: true,
                  message: 'Ingrese una cantidad',
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Estado"
              name="state_product"
              required={false}
              rules={[{ required: true, message: 'Ingrese un valor' }]}
            >
              <Select
                options={[
                  { label: 'Nuevo', value: 'NUEVO' },
                  { label: 'Usado', value: 'USADO' },
                  { label: 'Defectuoso', value: 'DEFECTUOSO' },
                ]}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Categoría"
              name="category"
              required={false}
              rules={[{ required: true, message: 'Ingrese un valor' }]}
            >
              <Select
                options={categoriesOptions}
                style={{ textTransform: 'capitalize' }}
                dropdownStyle={{ textTransform: 'capitalize' }}
              ></Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Filial"
              name="subsidiary"
              required={false}
              rules={[{ required: true, message: 'Ingrese un valor' }]}
            >
              <Select options={subsidiaryOptions}></Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Imagenes"
          name="images"
          required={true}
          rules={[{ required: true, message: 'Cargue al menos una imagen' }]}
        >
          <Upload
            action=""
            headers={{ authorization: 'authorization-text' }}
            beforeUpload={(file) => {
              setFiles([...files, file])
              return false
            }}
            onChange={(info) => {
              console.log(info)
            }}
            onRemove={(deletedFile) => {
              setFiles(files.filter((f) => f.uid === deletedFile.uid))
            }}
            accept="image/png, image/jpeg"
          >
            <Button icon={<UploadOutlined />} disabled={files.length === 5}>
              Cargar imagen
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
