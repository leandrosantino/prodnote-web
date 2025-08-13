import { useState, type JSX } from "react";

export class ComponentController<P = any> {
  static View: () => JSX.Element;
  props: P = {} as P;
  protected useState<T>(initial?: T) {
    const [value, set] = useState<T>(initial as T)
    return { value, set }
  }
}