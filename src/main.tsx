import 'reflect-metadata'

import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { Home } from './modules/home/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Success } from './modules/Success'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/:ute" Component={Home} />
        <Route path="/" Component={Home} />
        <Route path="/success" Component={Success} />
      </Routes>
    </BrowserRouter>
  </>
)
