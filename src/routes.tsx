import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './modules/form/form.controller';

import { Unavailable } from "./components/unavailable";
import { Success } from "./modules/form/components/Success";

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
        {/*
        <Route path="/" Component={Form} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/" Component={Lab} />
        <Route path="/table" Component={Table} />
        */}
        <Route path="/success" Component={Success} />
        <Route path="/:ute" Component={Form} />
      </Routes>
    </BrowserRouter>
  )
}
