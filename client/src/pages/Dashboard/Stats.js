import React, { useState } from 'react'
import { useGlobleContext } from '../../context/appContext'
import { ChartsContainer, Loading, StatsContainer } from '../../components'
const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useGlobleContext()

  useState(() => {
    showStats()
  }, [])

  if (isLoading) {
    <Loading center />
  }
  return (
    <>
      <StatsContainer />

      {
        monthlyApplications.length > 0 && <ChartsContainer />
      }

    </>
  )


}

export default Stats