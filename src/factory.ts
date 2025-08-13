import { container } from "tsyringe";
import { ProductionProcessRepository } from "./repositories/ProductionProcessRepository";
import { EfficiencyRecordRepository } from "./repositories/EfficiencyRecordRepository";
import { EfficiencyRecordService } from "./services/EfficiencyRecordService";
import { ListEfficiencyRecordCached } from "./warpers/ListEfficiencyRecordCached";
import { ReportService } from "./services/ReportService";


container.registerSingleton('ProductionProcessRepository', ProductionProcessRepository)
container.registerSingleton('EfficiencyRecordRepository', EfficiencyRecordRepository)
container.registerSingleton('EfficiencyRecordService', EfficiencyRecordService)

container.registerSingleton('ListEfficiencyRecordCached', ListEfficiencyRecordCached)
container.registerSingleton('ReportService', ReportService)
