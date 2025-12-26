import { React, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../Context/AuthContext"; // Fixed path (lowercase 'c')
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";
import { motion } from "framer-motion";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, loginWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%", maxWidth: 480 }}
        >
          <Paper
            elevation={20}
            sx={{
              padding: 6,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
            }}
          >
            <Grid container spacing={3} justifyContent="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    boxShadow: "0 0 30px rgba(144,202,249,0.6)",
                  }}
                >
                  <LoginIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>
            </Grid>

            <Typography
              component="h1"
              variant="h3"
              align="center"
              fontWeight="bold"
              sx={{
                mt: 2,
                mb: 1,
                textShadow: "0 0 20px rgba(144,202,249,0.4)",
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Sign in to continue managing your tasks
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                autoComplete="email"
                autoFocus
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  },
                }}
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  },
                }}
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 2,
                  fontSize: "1.2rem",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #1976d2, #90caf9)",
                  boxShadow: "0 0 30px rgba(144,202,249,0.5)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #64b5f6)",
                    boxShadow: "0 0 40px rgba(144,202,249,0.7)",
                  },
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  borderColor: "#4285f4",
                  color: "#4285f4",
                  "&:hover": {
                    borderColor: "#3367d6",
                    backgroundColor: "rgba(66, 133, 244, 0.04)",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#90caf9",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Create one here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
