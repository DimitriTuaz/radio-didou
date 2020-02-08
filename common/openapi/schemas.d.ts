/** Loopback 4 - OpenApi Schemas **/

export interface NowCredentials {
  id?: string
  userId?: string
  name: string
  type: number
  token: string
}

export interface User {
  id?: string
  email: string
  firstName?: string
  lastName?: string
}

export interface NewUser {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  password: string
}

