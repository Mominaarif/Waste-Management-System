import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandfillDesign from "./landfill";
import RDFDesign from "./RDF";
import MRFDesign from "./MRF";
import AnaerobicDigesterCalculator from "./Anaerobic";
import "./App.css";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Sidebar from "./Sidebar";

const App = () => {
  return (
    <>
     <Router>
     <Routes>
          
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
         
        </Routes>
      </Router>
    <div className=" flex  w-full">
      {" "}
      <Sidebar />
      <Router>
        <Routes>
          <Route path="/RDF-design" element={<RDFDesign />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> */}
          <Route path="/landfill-design" element={<LandfillDesign />} />
          <Route path="/MRF-design" element={<MRFDesign />} />
          <Route
            path="/anaerobic-design"
            element={<AnaerobicDigesterCalculator />}
          />
        </Routes>
      </Router>
    </div>
    </>
  );
};

export default App;
