import { useEffect, useState } from 'react'
import { ExchangerModel, UserStateName, UserStateNameEnum } from '@Common/api'
import { Card, Flex, Spin, Statistic, Typography } from 'antd'
import { Column } from '@ant-design/charts'

type ColumnExchangersPerStateProps = {
  isLoading: boolean
  exchangers: ExchangerModel[]
}

type DataType = {
  state: UserStateName
  amount: number
}

export function ColumnExchangersPerState({
  isLoading,
  exchangers,
}: ColumnExchangersPerStateProps) {
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    if (isLoading) return

    setData(
      Object.values(UserStateNameEnum)
        .map((state) => ({
          state,
          amount: exchangers.filter(({ user_state }) => user_state === state)
            .length,
        }))
        .sort((a, b) => a.state.localeCompare(b.state))
    )
  }, [exchangers, isLoading])

  return (
    <Card>
      <Typography.Title level={3}>
        Cantidad de intercambiadores por estado
      </Typography.Title>

      {isLoading || data.length === 0 ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <>
          <ExchangerStatistics data={data} />

          <Column
            loading={isLoading || data.length === 0}
            data={data}
            xField="state"
            yField="amount"
            height={500}
            colorField="state"
            scale={{ color: { palette: 'category10' } }}
          />
        </>
      )}
    </Card>
  )
}

function ExchangerStatistics({ data }: { data: DataType[] }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={36}
      style={{
        textTransform: 'capitalize',
        overflowX: 'auto',
        margin: '1.5rem 0.25rem',
      }}
    >
      <Statistic
        title="Total"
        value={data.reduce((acc, curr) => acc + curr.amount, 0)}
        style={{ minWidth: 'fit-content', fontWeight: 700 }}
      />
      {data.map(({ state, amount }) => (
        <Statistic
          key={state}
          title={state}
          value={amount}
          style={{ minWidth: 'fit-content' }}
        />
      ))}
    </Flex>
  )
}
