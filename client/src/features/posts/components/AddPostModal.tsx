import {
  getCategoryList,
  getSubsidiaries,
} from '@Posts/helpers/getPostsListsExchanger'
import { App, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import { useEffect, useState } from 'react'

type AddPostModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type SelectOption = {
  label: string
  value: string
}

type AddPostForm = {
  name: string
  description: string
  value: number
  stock_product: string
  state_product: string
  category: string
  subsidiary: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

async function mapSubsidiariesToSelectOption(): Promise<SelectOption[]> {
  const subsidiaries = await getSubsidiaries()
  return subsidiaries.map(({ name }) => ({ label: name, value: name }))
}

export default function AddPostModal({ isOpen, setIsOpen }: AddPostModalProps) {
  const { notification } = App.useApp()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([])
  const [subsidiaryOptions, setSubsidiaryOptions] = useState<SelectOption[]>([])

  const [form] = Form.useForm<AddPostForm>()

  // Cargar datos en los select
  useEffect(() => {
    mapCategoiresToSelectOptions().then(setCategoriesOptions)
    mapSubsidiariesToSelectOption().then(setSubsidiaryOptions)
  }, [])

  function handleOk() {
    setConfirmLoading(true)
    setTimeout(() => {
      setIsOpen(false)
      setConfirmLoading(false)
      notification.success({
        message: 'Publicación agregada correctamente',
        description: 'Se ha agregado la publicación',
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }, 2000)
  }

  return (
    <Modal
      title="Agregar publicación"
      open={isOpen}
      onOk={handleOk}
      onCancel={() => setIsOpen(false)}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical" style={{ marginTop: '1.25rem' }} form={form}>
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
              <InputNumber min={0} style={{ width: '100%' }} defaultValue={1} />
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
      </Form>
    </Modal>
  )
}
