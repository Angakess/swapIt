import { SearchOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'
import { SearchBar, SearchBarProps } from './SearchBar'
import { SelectFilter, SelectFilterProps } from './SelectFilter'

type SearchAndFilterProps = {
  searchBar: SearchBarProps
  filters: SelectFilterProps[]
}

export function SearchAndFilter({ searchBar, filters }: SearchAndFilterProps) {
  return (
    <>
      <SearchBar {...searchBar} />

      <Flex gap={'1rem'} style={{ marginBottom: '1rem' }}>
        {filters.map((filter) => (
          <SelectFilter key={filter.placeholder} {...filter} />
        ))}
      </Flex>

      <Flex justify="end">
        <Button type="primary" icon={<SearchOutlined />}>
          Buscar
        </Button>
      </Flex>
    </>
  )
}
