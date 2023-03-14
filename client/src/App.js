import React from 'react'
import { Landing, Register, Error, ProtectesRoute } from './pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AddJob, Profile, AllJobs, Stats, SharedLayout } from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectesRoute>
            <SharedLayout />
          </ProtectesRoute>
        }>
          <Route index element={<Stats />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='profile' element={<Profile />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />

      </Routes>
    </BrowserRouter >
  )
}

export default App;
