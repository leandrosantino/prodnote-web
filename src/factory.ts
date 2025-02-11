import { container } from "tsyringe";
import { ProductionProcessRepository } from "./repositories/production-process/ProductionProcessRepository";
import { EfficiencyRecordRepository } from "./repositories/efficiency-record/EfficiencyRecordRepository";
import { EfficiencyRecordService } from "./services/efficiency-record/EfficiencyRecordService";
import { ListEfficiencyRecordCached } from "./warpers/ListEfficiencyRecordCached";


container.registerSingleton('ProductionProcessRepository', ProductionProcessRepository)
container.registerSingleton('EfficiencyRecordRepository', EfficiencyRecordRepository)
container.registerSingleton('EfficiencyRecordService', EfficiencyRecordService)

container.registerSingleton('ListEfficiencyRecordCached', ListEfficiencyRecordCached)
