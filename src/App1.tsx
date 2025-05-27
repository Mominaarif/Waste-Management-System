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
import SurveyCommPage from "./pages/SurveyCommunityPage";
import SurveyGoverPage from "./pages/SurveyGoverPage";
import EconomyFormPage from "./pages/EconomyFormPage";
import ForecastPage1 from "./pages/ForecastPage";
import AddLandfillsPage from "./pages/AddLandfillsPage";
import HeatPage from "./pages/HeatPage";

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

console.log(open)
  return (
    <div className="flex w-full">
      {!hideSidebar && <div className="hidden md:flex"><Sidebar /></div> }
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/RDF-design" element={<RDFPage setOpen={setOpen} open={open} />} />
        <Route path="/home" element={<HomePage setOpen={setOpen} open={open}/>} />
        <Route path="/landfills" element={<LandfillsPage setOpen={setOpen} open={open}/>} />
        <Route path="/add-landfills" element={<AddLandfillsPage setOpen={setOpen} open={open}/>} />
        <Route path="/" element={<HomePage2 setOpen={setOpen} open={open}/>} />
        <Route path="/landfill-design" element={<LandfillPage setOpen={setOpen} open={open} />} />
        <Route path="/MRF-design" element={<MRFPage setOpen={setOpen} open={open} />} />
        <Route path="/add-data" element={<AddDataPage setOpen={setOpen} open={open} />} />
        <Route path="/map" element={<GenerateMapPage setOpen={setOpen} open={open} />} />
        <Route path="/waste-categories" element={<WasteCategoriesPage setOpen={setOpen} open={open} />} />
        <Route path="/survey-comm" element={<SurveyCommPage setOpen={setOpen} open={open} />} />
        <Route path="/survey-gover" element={<SurveyGoverPage setOpen={setOpen} open={open} />} />
        <Route path="/economy-analysis" element={<EconomyFormPage setOpen={setOpen} open={open} />} /> 
        <Route path="/forecast" element={<ForecastPage1 setOpen={setOpen} open={open}  />} />
        <Route path="/heatmap" element={<HeatPage setOpen={setOpen} open={open}  />} />

        <Route
          path="/anaerobic-design"
          element={<AnaerobticPage setOpen={setOpen} open={open} />}
        />
      </Routes>
      {!hideSidebar && <MyChatbot />}
    </div>
  );
}
