import { container } from "tsyringe";
import { HomeView } from "./home.view";
import { HomeController } from "./home.controller";


const controller = container.resolve(HomeController)

export const Home = () => HomeView({ controller })
