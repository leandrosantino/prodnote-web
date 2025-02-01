// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import {Home} from './Pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Success } from './Pages/Success'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="success" Component={Success} />
      </Routes>
    </BrowserRouter>
  </>
)
