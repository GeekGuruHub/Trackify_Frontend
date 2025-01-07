import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginTest from "./Pages/login_test";
import Registration from "./Pages/Registration"; // Create this component

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginTest />} />
            <Route path="/Registration" element={<Registration />} />
        </Routes>
    );
}

export default App;
