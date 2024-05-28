import {
  Calendar,
  CalendarProps,
  Col,
  ConfigProvider,
  Flex,
  Row,
  Select,
} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/es'
import esES from 'antd/locale/es_ES'

dayjs.extend(localeData)
dayjs.locale('es') // Establece el idioma español

function capitalizeMonth(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

//Contenido de cada caja del calendario
const dateCellRender = (value: Dayjs) => {
  return (
    <Flex align="center" justify="center">
      {value.isSame('06/08/2024', 'date') ? ( //Cambiar
        <CheckCircleOutlined style={{ fontSize: '32px', color: '#14518B' }} />
      ) : null}
    </Flex>
  )
}

const cellRender: CalendarProps<Dayjs>['cellRender'] = (current) => {
  return dateCellRender(current)
}

export function CalendarTurn() {
  return (
    <>
      <ConfigProvider locale={esES}>
        <Calendar
          defaultValue={dayjs('08/06/2024', 'DD/MM/YYYY')} //Cambiar
          fullscreen={false}
          style={{ marginBottom: '0'}}
          mode="month"
          headerRender={({ value, onChange }) => {
            const start = 0
            const end = 12
            const monthOptions = []

            const localeData = value.localeData()
            const months: string[] = localeData.monthsShort()

            for (let i = start; i < end; i++) {
              monthOptions.push(
                <Select.Option key={i} value={i} className="month-item">
                  {capitalizeMonth(months[i])}
                </Select.Option>
              )
            }

            const year = value.year()
            const month = value.month()
            const options = []
            for (let i = year - 10; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              )
            }
            return (
              <div style={{ padding: 8 }}>
                <Row gutter={8}>
                  <Col>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear)
                        onChange(now)
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth)
                        onChange(now)
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            )
          }}
          cellRender={cellRender}
        ></Calendar>
      </ConfigProvider>
    </>
  )
}
