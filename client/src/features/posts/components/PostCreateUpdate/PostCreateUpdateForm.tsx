import { getCategoryList, getSubsidiaries } from '@Common/api'
import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
} from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload'
import React, { useEffect, useState } from 'react'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoriesToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }))
}

async function mapSubsidiariesToSelectOption(): Promise<SelectOption[]> {
  const subsidiaries = await getSubsidiaries()
  return subsidiaries
    .filter(({ active }) => active)
    .map(({ name, id }) => ({ label: name, value: id.toString() }))
}

export type PostCreateUpdateForm = {
  name: string
  description: string
  value: number
  stock_product: number
  state_product: string
  category: string
  subsidiary: string
}

type PostCreateUpdateFormProps = {
  form: FormInstance<PostCreateUpdateForm>
  files: RcFile[]
  setFiles: React.Dispatch<React.SetStateAction<RcFile[]>>
  fileList: UploadFile[]
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  handleFinish: (values: PostCreateUpdateForm) => void
  isLoading: boolean
}

export function PostCreateUpdateForm({
  form,
  files,
  setFiles,
  fileList,
  setFileList,
  handleFinish,
  isLoading,
}: PostCreateUpdateFormProps) {
  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([])
  const [subsidiaryOptions, setSubsidiaryOptions] = useState<SelectOption[]>([])

  // Cargar datos en los select
  useEffect(() => {
    mapCategoriesToSelectOptions().then(setCategoriesOptions)
    mapSubsidiariesToSelectOption().then(setSubsidiaryOptions)
  }, [])

  return (
    <Form
      layout="vertical"
      style={{ marginTop: '1.25rem' }}
      form={form}
      onFinish={handleFinish}
      disabled={isLoading}
    >
      <Form.Item
        label="Nombre"
        name="name"
        required={false}
        rules={[{ required: true, message: 'Ingrese el nombre del producto' }]}
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
            />
          </Form.Item>
        </Col>

        <Col xs={12} md={6}>
          <Form.Item
            label="Cantidad"
            name="stock_product"
            required={false}
            rules={[{ required: true, message: 'Ingrese una cantidad' }]}
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
            />
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
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Filial"
            name="subsidiary"
            required={false}
            rules={[{ required: true, message: 'Ingrese un valor' }]}
          >
            <Select options={subsidiaryOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Imágenes"
        name="images"
        required={false}
        rules={[
          {
            validator: () => {
              if (fileList.length > 0) return Promise.resolve()
              return Promise.reject(new Error('Cargue al menos una imagen'))
            },
          },
        ]}
      >
        <Upload
          listType="picture"
          fileList={fileList}
          beforeUpload={(file) => {
            setFiles((prevFiles) => [...prevFiles, file])
            return false
          }}
          onChange={({ fileList }) => setFileList(fileList)}
          onRemove={(deletedFile) => {
            setFiles(files.filter((f) => f.uid !== deletedFile.uid))
            setFileList(fileList.filter((f) => f.uid !== deletedFile.uid))
          }}
          accept="image/png, image/jpeg"
        >
          <Button icon={<UploadOutlined />} disabled={fileList.length === 5}>
            Cargar imagen
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  )
}
