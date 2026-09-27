import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import {ProtectedRoute} from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Report from "./pages/Report";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
