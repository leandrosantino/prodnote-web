import 'reflect-metadata'
import './factory'

import { createRoot } from 'react-dom/client'
import './global.css'
import { AppRoutes } from './routes'

createRoot(document.getElementById('root')!).render(<AppRoutes />)
