export type Exchanger = {
    id: number
    full_name: string
    dni: string
    email: string
    gender: string
    date_of_birth: string
    phone_number: string
    score:number
    state: {
      id: number
      name: string
    }
  }