import { container } from "tsyringe";
import { HomeView } from "./home.view";
import { HomeController } from "./home.controller";

export function Home() {
  const controller = container.resolve(HomeController)
  return HomeView({ controller })
}
