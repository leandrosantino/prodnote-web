import type { ComponentController } from "./ComponentController";

export type ComponentView<P extends ComponentController<any>> = React.ComponentType<P['props']>