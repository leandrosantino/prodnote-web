import 'reflect-metadata'

import { createRoot } from 'react-dom/client'
import './global.css'
import { AppRoutes } from './routes'

import { container } from "tsyringe";
import { ProcessRepository } from "./repositories/ProcessRepository";
import { ProductionRegistryRepository } from "./repositories/ProductionRegistryRepository";
import { ProductionRegistryService } from "./services/ProductionRegistryService";
import { ReportService } from "./services/ReportService";


container.registerSingleton('ProcessRepository', ProcessRepository)
container.registerSingleton('ProductionRegistryRepository', ProductionRegistryRepository)
container.registerSingleton('ProductionRegistryService', ProductionRegistryService)

container.registerSingleton('ReportService', ReportService)


createRoot(document.getElementById('root')!).render(<AppRoutes />)
