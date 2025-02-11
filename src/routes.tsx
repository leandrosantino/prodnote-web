import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./modules/dashboard";
import { Success } from "./modules/form/components/Success";
import { Unavailable } from "./components/unavailable";
import { Table } from "./modules/table";
import { Form } from "./modules/form";

export function AppRoutes() {

  if(import.meta.env.VITE_APP_STATUS === 'off'){
    return <Unavailable />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:ute" Component={Form} />
        <Route path="/" Component={Form} />
        <Route path="/success" Component={Success} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/table" Component={Table} />
      </Routes>
    </BrowserRouter>
  )
}
