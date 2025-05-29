"use client";
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "./SidebarContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
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
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const steps = [
  {
    id: "0",
    message: "Hi!",
    trigger: "1",
  },
  {
    id: "1",
    message: "What is your name?",
    trigger: "2",
  },
  {
    id: "2",
    user: true,
    trigger: "3",
  },
  {
    id: "3",
    message: "Nice to meet you, {previousValue}!",
    trigger: "4",
  },
  {
    id: "4",
    message: "Ask me any question related to solid waste management...",
  },
];
export function MainLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/signin", "/signup"];

  const hideSidebar = hideSidebarRoutes.includes(location.pathname);
  const [open, setOpen] = useState(false);

  return (
    
    <div className="flex w-full">
      {!hideSidebar && (
        <div className="hidden md:flex">
          <Sidebar />
        </div>
      )}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/RDF-design"
          element={
            <ProtectedRoute>
              <RDFPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landfills"
          element={
            <ProtectedRoute>
              <LandfillsPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-landfills"
          element={
            <ProtectedRoute>
              <AddLandfillsPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage2 setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landfill-design"
          element={
            <ProtectedRoute>
              <LandfillPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MRF-design"
          element={
            <ProtectedRoute>
              <MRFPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-data"
          element={
            <ProtectedRoute>
              <AddDataPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <GenerateMapPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waste-categories"
          element={
            <ProtectedRoute>
              <WasteCategoriesPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey-comm"
          element={
            <ProtectedRoute>
              <SurveyCommPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey-gover"
          element={
            <ProtectedRoute>
              <SurveyGoverPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/economy-analysis"
          element={
            <ProtectedRoute>
              <EconomyFormPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <ForecastPage1 setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <HeatPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/anaerobic-design"
          element={
            <ProtectedRoute>
              <AnaerobticPage setOpen={setOpen} open={open} />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideSidebar && <MyChatbot />}
    </div>
  );
}

// components/ProtectedRoute.tsx
// import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import { auth } from "./firebase";
// import { getAuth } from "firebase/auth";
type UserData = {
  email?: string;
  displayName?: string;
};
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
   const [user, setUser] = useState<UserData>({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// export default ProtectedRoute;
