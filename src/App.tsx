import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LandfillDesign from "./components/landfill";
import RDFDesign from "./components/RDF";
import MRFDesign from "./components/MRF";
import AnaerobicDigesterCalculator from "./components/Anaerobic";
import "./Styles/App.css";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router> 
      
      <div className=" flex  w-full">
      
        {!hideSidebar && <Sidebar />}

        <Router>
          <Routes>
            {window.location.pathname === "/signin" ||
            window.location.pathname === "/signin" ? (
              <>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />{" "}
              </>
            ) : (
              <>
                <Sidebar />
                <Route path="/RDF-design" element={<RDFDesign />} />
               
                <Route path="/landfill-design" element={<LandfillDesign />} />
                <Route path="/MRF-design" element={<MRFDesign />} />
                <Route
                  path="/anaerobic-design"
                  element={<AnaerobicDigesterCalculator />}
                />
              </>
            )}

          <Route path="/RDF-design" element={<RDFDesign />} />
            <Route path="/" element={<Home />} />
           
            <Route path="/landfill-design" element={<LandfillDesign />} />
            <Route path="/MRF-design" element={<MRFDesign />} />
            <Route
              path="/anaerobic-design"
              element={<AnaerobicDigesterCalculator />}
            /> 
          </Routes>
        </Router>
      </div> */}

      <Router>
        <MainLayout />
      </Router>
    </>
  );
};

export default App;

function MainLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/signin", "/signup"];

  // check if current path is in hidden routes
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex w-full">
      {/* Sidebar only when route is not in hidden list */}
      {!hideSidebar && <div className="hidden md:flex"><Sidebar /></div> }

      {/* Your actual routes */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/RDF-design" element={<RDFDesign />} />
        <Route path="/" element={<Home />} />
        <Route path="/landfill-design" element={<LandfillDesign />} />
        <Route path="/MRF-design" element={<MRFDesign />} />
        <Route
          path="/anaerobic-design"
          element={<AnaerobicDigesterCalculator />}
        />
      </Routes>
    </div>
  );
}
