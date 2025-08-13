import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Success } from "./modules/form/components/Success";
import { Unavailable } from "./components/unavailable";
// import { uploadDataToFirestore } from "./seed";

import  Table  from "./modules/table/table.component";
import Dashboard from "./modules/dashboard/dashboard.controller";
import Form  from "./modules/form/form.controller";
import Lab  from "./modules/lab/lab.controller";

export function AppRoutes() {

  if(import.meta.env.VITE_APP_STATUS === 'off'){
    return <Unavailable />
  }

  useEffect(() => {
    // uploadDataToFirestore()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:ute" Component={Form} />
        <Route path="/" Component={Form} />
        <Route path="/success" Component={Success} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/table" Component={Table} />
        <Route path="/Lab" Component={Lab} />
      </Routes>
    </BrowserRouter>
  )
}
