import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Lab  from "./modules/lab/lab.controller";
import { Unavailable } from "./components/unavailable";

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
        {/* <Route path="/:ute" Component={Form} />
        <Route path="/" Component={Form} />
        <Route path="/success" Component={Success} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/table" Component={Table} /> */}
        <Route path="/" Component={Lab} />
      </Routes>
    </BrowserRouter>
  )
}
