import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './modules/form/form.controller';
import { Unavailable } from "./components/unavailable";
import { Success } from "./modules/form/components/Success";
import Dashboard from "./modules/dashboard/dashboard.controller";
import Table from "./modules/table/table.controller";

export function AppRoutes() {

  if(import.meta.env.VITE_APP_STATUS === 'off'){
    return <Unavailable />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table" Component={Table} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/success" Component={Success} />
        <Route path="/:ute" Component={Form} />
        {/* <Route path="/:ute" Component={Production} /> */}
      </Routes>
    </BrowserRouter>
  )
}
