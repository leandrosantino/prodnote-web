import type { JSX } from "react";
import { container, injectable } from "tsyringe";

export function component(view: (props: any) => JSX.Element): ClassDecorator {
    return (target) => {
        injectable()(target as any);
        (target as any)['View'] = (props: any) => {
            const controller = container.resolve(target as any);
            (controller as any)['props'] = props
            return view(controller);
        }
    }
}
