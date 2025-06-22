import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import LoginPage from './components/LoginPage';
import CaretakerDashboard from './components/CareTakerDashboard';
import MedicationTracker from './components/MedicationTracker';
import PatientDashboard from './components/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}  />
        <Route exact path="/signup" element={<Signup />}  /> 
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/caretaker-dashboard" element={<ProtectedRoute><CaretakerDashboard /></ProtectedRoute>} />
        <Route exact path="/medication" element={<ProtectedRoute><MedicationTracker /></ProtectedRoute>} /> 
        <Route exact path="/patient-dashboard/:userId" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

