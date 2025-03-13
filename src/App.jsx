import logo from './logo.svg';
import './App.css';
import 'animate.css';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import bootstrap from "bootstrap";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { NavBar } from './components/navbar';
import { HomePage } from './components/home-page';
import { AdminLogin } from './components/admin-login';
import { AdminDashBoard } from './components/admin-dashboard';


function App() {
  return (
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path='/' element={<HomePage />}  />
      <Route path='admin-login' element={<AdminLogin />} />
      <Route path='admin-dashboard' element={<AdminDashBoard />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
