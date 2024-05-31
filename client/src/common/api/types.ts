export type GenericApiResponse<T> = {
  ok: boolean
  data: T
  messages: string[]
}

export type UserModel = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: string
  state: {
    name: string
  }
}

export type SubsidiaryModel = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}

export type StateModel = {
  id: number
  name:
    | 'activo'
    | 'pendiente'
    | 'suspendido'
    | 'bloqueado'
    | 'eliminado'
    | 'rechazado'
}

export type CategoryModel = {
  id: number
  name: string
  active: boolean
}

export type ProductStateModel = 'NUEVO' | 'USADO' | 'DEFECTUOSO'

export type PostModel = {
  id: number
  name: string
  description: string
  value: number
  user: UserModel
  subsidiary: SubsidiaryModel
  state: StateModel
  category: CategoryModel
  state_product: ProductStateModel
  stock_product: number
  image_1: string
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}

export type PostBasicModel = {
  id: number
  name: string
  description: string
  value: number
  user: number
  subsidiary: number
  state: number
  category: number
  state_product: ProductStateModel
  stock_product: number
  image_1: string
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}
