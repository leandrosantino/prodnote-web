import { container } from "tsyringe";
import { ProductionProcessRepository } from "./repositories/production-process/ProductionProcessRepository";


container.registerSingleton('ProductionProcessRepository', ProductionProcessRepository)
