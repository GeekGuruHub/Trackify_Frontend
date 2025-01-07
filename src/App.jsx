import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginTest from './Pages/login_test';
import Dashboard from './Pages/Dashboard';
import Footer from './Components/Footer';
import HomePage from './Pages/Home_page';
import Registration from "./Pages/Registration";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route index element={<HomePage />} />

        {/* Specific routes */}
        <Route path="/login_test" element={<LoginTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
    <Footer/>
    </>
    
    
  );
}

export default App;
