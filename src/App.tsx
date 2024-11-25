import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import Training from './pages/Training';
import MissingPersons from './pages/MissingPersons';
import Supervisions from './pages/Supervisions';
import ComplianceManagement from './pages/ComplianceManagement';
import Settings from './pages/Settings';
import OfstedRequirements from './pages/OfstedRequirements';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <Dashboard />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/staff" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <StaffManagement />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/training" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <Training />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/missing-persons" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <MissingPersons />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/supervisions" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <Supervisions />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/compliance" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <ComplianceManagement />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/settings" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <Settings />
            </main>
          </div>
        </div>
      } />} />
      <Route path="/ofsted-requirements" element={<PrivateRoute element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <OfstedRequirements />
            </main>
          </div>
        </div>
      } />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;