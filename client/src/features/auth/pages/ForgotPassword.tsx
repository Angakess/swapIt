import { AuthTitle } from "@Auth/components";
import { Form, InputNumber, Button } from "antd"
import { useState } from "react";

export function ForgotPassword() {
  
  
  return (
    <>
      <AuthTitle>¿Has olvidado tu contraseña?</AuthTitle>
      <Form layout="vertical"
            style={{}}
      >
        <Form.Item label="DNI">
          <InputNumber
            placeholder="DNI"
            size="large"
            style={{ width: '100%' }}
            controls={false}
            autoFocus
          />
        </Form.Item>
        
        <Form.Item>
          <p>Enviaremos un código de recuperación por email si el DNI ingresado coincide con una cuenta de SwapIt existente</p>   
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            size="large"
            style={{ marginTop: '0.5rem'}}
          >
            Enviar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="default"
            size="middle"
            style={{ display: 'block',
              margin: 'auto',
              marginTop: '0.5rem',
              width: '40%' }}
          >
            Volver
          </Button>
        </Form.Item>

      </Form>

    
    </>
  )
}
