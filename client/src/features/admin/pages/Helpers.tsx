import { Button, Card, Space, Table, Input, TablePaginationConfig, TableColumnsType, TableColumnType, InputRef } from "antd";
import { GetProp, TableProps } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useState, useEffect, useRef } from "react"
import type { FilterDropdownProps } from "antd/es/table/interface"

//archivo JSON sacado de mockaroo.com local para testear
//import MOCK_DATA from "./MOCK_DATA.json"


export function Helpers(){
    
    type ColumnsType<T> = TableProps<T>["columns"]
    type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>
    type DataIndex = keyof DataType

    interface DataType {
        nombre: string,
        filial: string,
        id: number,
    }

    interface TableParams {
        pagination?: TablePaginationConfig
        sortField?: string
        sortOrder?: string
        filters?: Parameters<GetProp<TableProps, "onChange">>[1]
    }

    

    /* const getRandomUserParams = (params: TableParams) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    }) */

    const [data, setData] = useState<DataType[]>()
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    const fetchData = () => {
        setLoading(true)
    
        
        /* //------Version mock---------------------------------------------------------------
        setData(MOCK_DATA)
                setLoading(false)
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200
                    },
                })
        //---------------------------------------------------------------------------------- */
        
        
        //------Version real----------------------------------------------------------------
        /* fetch("./MOCK_DATA.json")
            .then((res) => res.json())
            .then(({results}) => {
                setData(results)
                setLoading(false)
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200 //mock data (tendria que ser algo como data.totalCount)
                    },
                })
            }) */
        //------------------------------------------------------------------------------------
    }

    useEffect(() => {
        fetchData()
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize])

    const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        })
        if(pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([])
        }
    }

    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const searchInput = useRef<InputRef>(null)

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: DataIndex,
    ) => {
        confirm(),
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters: () => void) => {
        clearFilters()
        setSearchText("")
    }

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input 
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block"}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{width: 90}}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90}}
                    >
                        Resetear
                    </Button>
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false})
                            setSearchText((selectedKeys as string[])[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filtrar
                    </Button> */}
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close()
                        }}
                    >
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? "#1677ff" : undefined}} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100)
            }
        },
        /* render: (text) =>
            searchedColumn !== dataIndex ? (text) : asda */
    })



    const columns: ColumnsType<DataType> = [
        {
            title: `Nombre`,
            dataIndex: "nombre",
            render: (nombre) => `${nombre}`,
            width: "%20",
            ...getColumnSearchProps("nombre"),
        },
        {
            title: "DNI",
            dataIndex: "id",
            ...getColumnSearchProps("id"),
        },
        {
            title: "Filial",
            dataIndex: "filial",
            ...getColumnSearchProps("filial"),
        },
        {
            title: "Acciones",
            render: () => (
                <Space >
                    <Button type="primary">Cambiar filial</Button>
                    <Button type="primary" danger>Desincorporar</Button>
                </Space>
            ),
            width: "%30"
        }
    ]

    return (
        <Table 
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
        />
    )
}