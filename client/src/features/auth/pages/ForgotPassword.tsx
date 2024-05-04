import { AuthTitle } from "@Auth/components";
import { Form, InputNumber, Button, FormProps } from "antd"
import { useState } from "react";

export function ForgotPassword() {
 
  const [dni, setDni] = useState<number | string | null>(null)

  const handleChange = (newDni: number | string | null) => {
    console.log(newDni)
    setDni(newDni)
  }
 
  const onFinish: FormProps<number | string | null>['onFinish'] = (values) => {
    console.log("Success: ", values)
  };

  const onFinishFailed: FormProps<number | string | null>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed: ', errorInfo)
  };

  return (
    <>
      <AuthTitle>¿Has olvidado tu contraseña?</AuthTitle>
      <Form layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="DNI"
          name="dni"
          rules={[{required: true, message: 'Porfavor ingrese su DNI'},
                  {validator: (_, value) => 
                    value && value.toString().length === 8  ?
                      Promise.resolve() :
                      Promise.reject("El DNI debe ser un número de 8 dígitos")
                  },
          ]}
          >
          <InputNumber
            placeholder="Ingrese su DNI (ej: 12345678)"
            size="large"
            style={{ width: '100%' }}
            controls={false}
            autoFocus
            value={dni}
            onChange={handleChange}
          />
        </Form.Item>
        
        <Form.Item>
          <p>Enviaremos un código de recuperación por email si el DNI ingresado coincide con una cuenta de SwapIt existente</p>   
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            size="large"
            style={{ marginTop: '0.5rem'}}
          >
            Enviar
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Button
            type="link"
            size="large"

            // ni idea si esto esta bien
            href="/auth/login"

            style={{ display: 'block',
              margin: 'auto',
              marginTop: '0.5rem',
              }}
          >
            Volver
          </Button>
        </Form.Item>

      </Form>
    </>
  )
}
