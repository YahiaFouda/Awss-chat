import Home from "./pages/Home";
import Login from "./pages/Login";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {

  const ProtectedRoute = ({ children }) => {
    let authorization=JSON.parse(localStorage.getItem('authorization'))
    if (!authorization||!authorization.token) {
      return <Navigate to="/login" />;
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
