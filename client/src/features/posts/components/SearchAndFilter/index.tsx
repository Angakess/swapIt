import { SearchOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'
import { SearchBar, SearchBarProps } from './SearchBar'
import { SelectFilter, SelectFilterProps } from './SelectFilter'

type SearchAndFilterProps = {
  searchBar: SearchBarProps
  filters: SelectFilterProps[]
  handleSearch: React.MouseEventHandler<HTMLElement>
}

export function SearchAndFilter({
  searchBar,
  filters,
  handleSearch,
}: SearchAndFilterProps) {
  return (
    <>
      <SearchBar {...searchBar} />

      <div style={{ overflowX: 'auto' }}>
        <Flex gap={'1rem'} style={{ marginBottom: '1rem' }}>
          {filters.map((filter) => (
            <SelectFilter key={filter.placeholder} {...filter} />
          ))}
        </Flex>
      </div>

      <Flex justify="end">
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Buscar
        </Button>
      </Flex>
    </>
  )
}
