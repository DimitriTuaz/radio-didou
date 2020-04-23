import React from 'react'
import { storesContext } from '../contexts'

export const useStore = () => React.useContext(storesContext)
