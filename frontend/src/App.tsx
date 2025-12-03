import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import jaJP from 'antd/locale/ja_JP';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import MainLayout from './components/Common/MainLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import UserManagement from './components/Master/UserManagement';
import EmployeeManagement from './components/Master/EmployeeManagement';
import EquipmentManagement from './components/Master/EquipmentManagement';
import ContractorManagement from './components/Master/ContractorManagement';
import EquipmentBooking from './components/Equipment/EquipmentBooking';
import CertificateUpload from './components/WorkCertificate/CertificateUpload';
import HistoryViewer from './components/Common/HistoryViewer';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={jaJP}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="change-password" element={<ChangePassword />} />

              <Route
                path="master/users"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="master/employees"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <EmployeeManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="master/equipments"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <EquipmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="master/contractors"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <ContractorManagement />
                  </ProtectedRoute>
                }
              />

              <Route path="equipment/booking" element={<EquipmentBooking />} />
              <Route path="certificates" element={<CertificateUpload />} />
              <Route path="history" element={<HistoryViewer />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;