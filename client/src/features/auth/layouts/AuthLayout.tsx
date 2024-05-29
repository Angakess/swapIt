import { Card, Col, Flex, Layout, Row } from 'antd'
import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Layout>
      <Layout.Content>
        <Row justify="center" align="top" style={{ minHeight: '100dvh' }}>
          <Col xs={22} style={{ maxWidth: '400px', marginTop: '10dvh' }}>
            <Flex justify="center" align="center">
              <Link to="/">
                <img
                  src="/logo-caritas.svg"
                  alt="logo caritas"
                  style={{
                    height: '4rem',
                    marginBottom: '1.25rem',
                  }}
                />
              </Link>
            </Flex>
            <Card
              bordered={false}
              styles={{ body: { padding: '2rem', marginBottom: '3rem' } }}
            >
              {<Outlet />}
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  )
}
