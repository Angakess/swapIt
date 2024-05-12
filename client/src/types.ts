export enum UserRole {
  ADMIN = 'ADMIN',
  HELPER = 'HELPER',
  EXCHANGER = 'EXCHANGER',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type User = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: UserRole
}

export type AuthContextType = {
  user: User | null
  isLoggedIn: () => boolean
  logIn: (user: User) => void
  logOut: () => void
}

export type Post = {
  id: number
  title: string
  description: string
  category: string
  state: string
  images: string[]
}
