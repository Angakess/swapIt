import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import { useState } from 'react'

export function PostAdd() {
  const [files, setFiles] = useState<any[]>([])

  /* 
        "name": "Pantalón",
        "description": "Pantalón de color azul",
        "value": 10000,
        "user": 1,
        "subsidiary": 1,
        "state": 1,
        "category": 2,
        "state_product": string,
        "image_1": "pantalon1.jpg",
    
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

  const onSubmit = (values: any) => {
    console.log('Success:', values)
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('value', values.value)
    formData.append('user', values.user)
    formData.append('subsidiary', values.subsidiary)
    formData.append('state', values.state)
    formData.append('category', values.category)
    formData.append('state_product', values.state_product)
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
          label="Name"
          name="name"
          required={true}
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input
            placeholder="Enter the name"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          required={true}
          rules={[{ required: true, message: 'Please enter the description' }]}
          style={{ marginBottom: '0.25rem' }}
        >
          <Input.TextArea
            placeholder="Enter the description"
            size="large"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          required={true}
          rules={[{ required: true, message: 'Please enter the value' }]}
        >
          <InputNumber
            placeholder="Enter the value"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="User"
          name="user"
          required={true}
          rules={[{ required: true, message: 'Please enter the user' }]}
        >
          <Input
            placeholder="Enter the user"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Subsidiary"
          name="subsidiary"
          required={true}
          rules={[{ required: true, message: 'Please enter the subsidiary' }]}
        >
          <Input
            placeholder="Enter the subsidiary"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="State"
          name="state"
          required={true}
          rules={[{ required: true, message: 'Please enter the state' }]}
        >
          <Input
            placeholder="Enter the state"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          required={true}
          rules={[{ required: true, message: 'Please enter the category' }]}
        >
          <Input
            placeholder="Enter the category"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Product State"
          name="state_product"
          required={true}
          rules={[
            { required: true, message: 'Please enter the product state' },
          ]}
        >
          <Input
            placeholder="Enter the product state"
            size="large"
            style={{ width: '100%' }}
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
