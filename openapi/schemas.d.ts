/** Loopback 4 - OpenApi Schemas **/

export interface NowObject {
  listeners: number
  song: string
  artists: array
  album?: string
  release_date?: string
  cover?: string
  url?: string
}

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

