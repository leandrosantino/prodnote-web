import { container } from "tsyringe";
import { EfficiencyRecordService } from "./services/efficiency-record/EfficiencyRecordService";
import { SpProductionProcessRepository } from "./repositories/production-process/SpProductionProcessRepository";
import { SpEfficiencyRecordRepository } from "./repositories/efficiency-record/SpEfficiencyRecordRepository";


container.registerSingleton('ProductionProcessRepository', SpProductionProcessRepository)
container.registerSingleton('EfficiencyRecordRepository', SpEfficiencyRecordRepository)
container.registerSingleton('EfficiencyRecordService', EfficiencyRecordService)

