import 'reflect-metadata'
import './factory'

import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Success } from './modules/Success'
import { Dashboard } from './modules/dashboard'
import { Table } from './modules/table'
import { Form } from './modules/form'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/:ute" Component={Form} />
        <Route path="/" Component={Form} />
        <Route path="/success" Component={Success} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/table" Component={Table} />
      </Routes>
    </BrowserRouter>
  </>
)
