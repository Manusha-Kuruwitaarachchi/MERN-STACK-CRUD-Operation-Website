import React, { useState } from 'react'; // Import React and useState
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import DashBoard from './DashBoard';
import CreateUser from './CreateUser';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Signup />} /> 
        <Route path="/dashBoard" element={<DashBoard />} /> 
        <Route path="/createUser" element={<CreateUser />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
