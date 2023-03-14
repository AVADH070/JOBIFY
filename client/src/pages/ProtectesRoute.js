import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGlobleContext } from '../context/appContext'

const ProtectesRoute = ({ children }) => {
  const { user } = useGlobleContext()

  if (!user) {
    return <Navigate to='/landing' />
  }
  return children
}

export default ProtectesRoute