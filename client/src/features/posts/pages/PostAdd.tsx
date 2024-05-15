import { useAuth } from '@Common/hooks'
import { getter } from '@Posts/helpers/getPostsListsExchanger'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Form, Input, InputNumber, Select, Upload, message } from 'antd'
import { useEffect, useState } from 'react'

const getFiliales = async () => {
  const response = await getter("/subsidiary/subsidiaries/", {})
  return { subsidiaries: response }
}

const getCategoryList = async () => {
  const response = await getter("/category/list/", { active: "true" })
    .then((response) => response.data)
  return response
}


const updateValues = (response: any, setter: any) => {
  //@ts-ignore
  setter(response.map((item) => ({
    // Usar func para capitalizar
    label: item.name,
    value: item.id
  })))

}

export function PostAdd() {
  const [files, setFiles] = useState<any[]>([])
  const [subsidiaries, setSubsidiaries] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const stateProducts = [
    { label: 'Nuevo', value: '1' },
    { label: 'Usado', value: '2' },
    { label: 'Reparado', value: '3' },
  ]

  useEffect(() => {
    getFiliales().then((response) => {
      updateValues(response.subsidiaries, setSubsidiaries)
    })
    getCategoryList().then((response) => {
      updateValues(response.categories, setCategories)
    })
  }, [])

  const { user } = useAuth()

  /* 
    Modifcar:
    - User id -> Tomarlo del useAuth
    - Subsidiary id -> Hacer fetch para obtener todas los subsidiary
    - State id -> Hacer fetch para obtener todas los state
    - Category id -> Hacer fetch para obtener todas los category
    - State product -> Seleccionar de un select. Listar los estados de productos

  */

  const props: UploadProps = {
    name: 'file',
    action: '',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload(file) {
      setFiles([...files, file])
      return false
    },
    onChange(info) {
      if (info.file)
        message.success(`${info.file.name} file uploaded successfully`)
      else message.error(`file upload failed.`)
    },
  }

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('value', values.value)
    formData.append('user', user!.id.toString())
    formData.append('subsidiary', values.subsidiary)
    formData.append('state', values.state)
    formData.append('category', values.category)
    formData.append('state_product', values.state_product)
    formData.append('stock_product', values.stock_product)
    formData.append('image_1', files[0])
    fetch('http://localhost:8000/post/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <>
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Nombre"
          name="name"
          required={true}
          rules={[{ required: true, message: 'Ingrese su nombre' }]}
        >
          <Input
            placeholder="Ingrese su nombre"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Descripcion"
          name="description"
          required={true}
          rules={[{ required: true, message: 'Ingrese la descripción del producto' }]}
          style={{ marginBottom: '0.25rem' }}
        >
          <Input.TextArea
            placeholder="Ingrese la descripción del producto"
            size="large"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          label="Valor"
          name="value"
          required={true}
          rules={[{ required: true, message: 'Ingrese el valor del producto' }]}
        >
          <InputNumber
            placeholder="Ingrese el valor"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Filiales"
          name="subsidiary"
          required={true}
          rules={[{ required: true, message: 'Por favor, seleccione la filial' }]}
        >
          <Select
            placeholder="Elija la filial"
            size="large"
            style={{ width: '100%' }}
            options={subsidiaries}
          />

        </Form.Item>

        <Form.Item
          label="Categorías"
          name="category"
          required={true}
          rules={[{ required: true, message: 'Por favor, seleccione la categoría' }]}
        >
          <Select
            placeholder="Elija la categoría"
            size="large"
            style={{ width: '100%' }}
            options={categories}
          />
        </Form.Item>



        <Form.Item
          label="Estado"
          name="state_product"
          required={true}
          rules={[{ required: true, message: 'Ingrese el estado del producto' }]}
        >
          <Select
            placeholder="Elija el estado del producto"
            size="large"
            style={{ width: '100%' }}
            options={stateProducts}
          />
        </Form.Item>


        <Form.Item
          label="Cantidad del producto"
          name="stock_product"
          required={true}
          rules={[
            { required: true, message: 'El minimo debe ser 1' },
          ]}
        >
          <Input
            placeholder="Ingrese la cantidad de unidades que tiene del producto"
            size="large"
            style={{ width: '100%' }}
            type='number'
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image_1"
          required={true}
          rules={[{ required: true, message: 'Please enter the image' }]}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Carga imagen</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            style={{ marginTop: '0.5rem' }}
          >
            Publicacion nueba
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

/* 

import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

const props: UploadProps = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);

export default App;



*/
