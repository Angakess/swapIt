//
// User types

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
