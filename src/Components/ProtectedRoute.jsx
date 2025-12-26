import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0d0d1e 0%, #16213e 100%)",
        }}
      >
        <CircularProgress size={60} thickness={5} sx={{ color: "#90caf9" }} />
        <Typography variant="h6" sx={{ mt: 3, color: "#90caf9" }}>
          Authenticating...
        </Typography>
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
