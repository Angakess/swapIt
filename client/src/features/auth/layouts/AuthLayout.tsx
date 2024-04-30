import { Card, Col, Flex, Layout, Row } from 'antd'

export function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Layout>
      <Layout.Content>
        <Row justify="center" align="top" style={{ minHeight: '100dvh' }}>
          <Col xs={22} style={{ maxWidth: '400px', marginTop: '10dvh' }}>
            <Flex justify="center" align="center">
              <img
                src="/logo-caritas.svg"
                alt="logo caritas"
                style={{
                  height: '5rem',
                  marginBottom: '1.25rem',
                }}
              />
            </Flex>
            <Card
              bordered={false}
              styles={{ body: { padding: '2rem', marginBottom: '3rem' } }}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  )
}
