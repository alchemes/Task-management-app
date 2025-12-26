import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { TasksProvider } from "./Context/TasksContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import TaskList from "./Pages/TaskList.jsx";
import TaskForm from "./Pages/TaskForm.jsx";
import NotFound from "./Pages/NotFound.jsx";

function App({ darkMode, setDarkMode }) {
  return (
    <AuthProvider>
      <TasksProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TaskList darkMode={darkMode} setDarkMode={setDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
