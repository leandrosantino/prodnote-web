import 'reflect-metadata'
import './factory'

import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { AppRoutes } from './routes'

createRoot(document.getElementById('root')!).render(<AppRoutes />)
