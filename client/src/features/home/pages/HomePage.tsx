import { Card, Image, Space, Typography, theme } from 'antd'

export function HomePage() {
  const { borderRadius } = theme.useToken().token

  return (
    <Space direction="vertical" size="large" style={{ marginBottom: '2rem' }}>
      <Card>
        <Image
          src="https://caritas.org.ar/wp-content/uploads/2021/07/quienes-somos-1-1024x603.jpg"
          style={{ borderRadius }}
        />
        <Typography.Title level={2} style={{ marginTop: '1rem' }}>
          Quiénes somos
        </Typography.Title>
        <Typography.Paragraph>
          Somos <strong>Cáritas Argentina</strong>, una organización de la
          Iglesia Católica que trabaja para dar respuesta a las problemáticas
          sociales que derivan de la pobreza. Somos más de 40. 000 voluntarios
          en 3.500 equipos de trabajo y estamos en todos los rincones del país.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Acompañamos a personas, familias y comunidades que se encuentran en
          situación de exclusión y vulnerabilidad. Les brindamos contención
          espiritual y herramientas concretas para que, por sus propios medios,
          sean capaces de transformar su realidad.
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Title level={2}>Pastoral Caritativa</Typography.Title>
        <Typography.Paragraph>
          Cáritas es amor en obras: nuestro servicio y nuestras acciones se
          inspiran en el amor a Dios y al prójimo. Buscando la verdadera
          dignificación del hombre, Cáritas se centra en tres momentos claves
          para llevar adelante su misión:
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Title level={2}>Tareas</Typography.Title>

        <Typography.Title level={3}>Asistencia</Typography.Title>
        <Typography.Paragraph>
          Forma de animar la caridad que consiste en dar respuestas a las
          necesidades mínimas o situaciones de emergencia de las comunidades más
          pobres.
        </Typography.Paragraph>
        <Typography.Paragraph>
          El desafío es no solamente dar de comer o abrigar sino acompañar a las
          familias y ser puerta de entrada para escuchar, contener, organizar y
          planificar tareas que estimulen la promoción humana.
        </Typography.Paragraph>

        <Typography.Title level={3}>Promoción humana</Typography.Title>
        <Typography.Paragraph>
          Busca modificar, mejorar y suscitar cambios que mejoren las
          condiciones de vida de los más pobres. Requiere incorporar a las
          personas en la búsqueda de soluciones a sus problemas junto con otros.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Este momento es menos inmediato en sus efectos pero más durable, lo
          que requiere un trabajo desde la planificación con la persona y la
          comunidad. Se debe propiciar un proceso de desarrollo humano integral
          que fomente el desarrollo conjunto de cualidades, capacidades,
          posibilidades y recursos de las personas, para que puedan actuar de
          manera autónoma y comprometida y ser protagonistas activos en la
          construcción del bien común de la comunidad a la que pertenecen.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Por ello son tareas fundamentales y complementarias la formación, la
          organización y la promoción comunitaria.
        </Typography.Paragraph>

        <Typography.Title level={3}>Asistencia</Typography.Title>
        <Typography.Paragraph>
          La Iglesia desde la búsqueda de un mundo de hermanos, apunta a
          transformar las estructuras injustas de pecado y producir cambios en
          toda la sociedad para acercarnos al Proyecto de Dios.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Promover la animación de la caridad transformadora es impulsar la
          reflexión y la formación de la conciencia social, acompañando acciones
          que permitan pasar de habitantes a ciudadanos.
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
