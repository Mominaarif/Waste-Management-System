"use client"
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./Styles/App.css";
import HomePage from "./pages/HomePage";
import HomePage2 from "./pages/HomePage2";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Sidebar from "./components/Sidebar";
import RDFPage from "./pages/RDFPage";
import LandfillPage from "./pages/LandfillPage";
import MRFPage from "./pages/MRFPage";
import AnaerobticPage from "./pages/AnaerobticPage";
import LandfillsPage from "./pages/LandfillsPage";
import MyChatbot from "./ChatBot";
import AddDataPage from "./pages/AddDataPage";
import GenerateMapPage from "./pages/GenerateMapPage";
import WasteCategoriesPage from "./pages/WasteCategoriesPage";

const steps = [
  {
    id: '0',
    message: 'Hi!',
    trigger: '1',
  },
  {
    id: '1',
    message: 'What is your name?',
    trigger: '2',
  },
  {
    id: '2',
    user: true,
    trigger: '3',
  },
  {
    id: '3',
    message: 'Nice to meet you, {previousValue}!',
    trigger: '4',
  },
  {
    id: '4',
    message: 'Ask me any question related to solid waste management...',
  }
];
export function MainLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/signin", "/signup"];

  const hideSidebar = hideSidebarRoutes.includes(location.pathname);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full">
      {!hideSidebar && <div className="hidden md:flex"><Sidebar /></div> }
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/RDF-design" element={<RDFPage setOpen={setOpen} open={open} />} />
        <Route path="/" element={<HomePage setOpen={setOpen} open={open}/>} />
        <Route path="/landfills" element={<LandfillsPage setOpen={setOpen} open={open}/>} />
        <Route path="/home" element={<HomePage2 setOpen={setOpen} open={open}/>} />
        <Route path="/landfill-design" element={<LandfillPage setOpen={setOpen} open={open} />} />
        <Route path="/MRF-design" element={<MRFPage setOpen={setOpen} open={open} />} />
        <Route path="/add-data" element={<AddDataPage setOpen={setOpen} open={open} />} />
        <Route path="/map" element={<GenerateMapPage setOpen={setOpen} open={open} />} />
        <Route path="/waste-categories" element={<WasteCategoriesPage setOpen={setOpen} open={open} />} />
        <Route
          path="/anaerobic-design"
          element={<AnaerobticPage setOpen={setOpen} open={open} />}
        />
      </Routes>
      <MyChatbot />
    </div>
  );
}
