import { Navigate, Route, Routes } from "react-router-dom"
import { useAppSelector } from "./store";
import LoginPage from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App
