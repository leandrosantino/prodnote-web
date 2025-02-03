import { useState } from "react";

export function useStateObject<T>(initial?: T) {
  const [value, set] = useState(initial as T)
  return { value, set }
}
