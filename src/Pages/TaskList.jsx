import React from "react";
import { useTasks } from "../Context/TasksContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  IconButton,
  Select,
  MenuItem,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  FolderOpen as FolderIcon,
  CheckCircle as CheckIcon,
  Autorenew as ProgressIcon,
} from "@mui/icons-material";

const TaskList = ({ darkMode, setDarkMode }) => {
  const { tasks, deleteTask, filter, setFilter, sort, setSort } = useTasks();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  const totalProjects = tasks.length;
  const completedProjects = tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const inProgressProjects = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const glassStyle = {
    background: darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(12px)",
    border: darkMode
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: 4,
    color: darkMode ? "white" : "#1a1a1c",
  };

  const subTextColor = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";

  return (
    <Box sx={{ py: 6, width: "100%", overflowX: "hidden" }}>
      <Container maxWidth={false}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={6}
          sx={{
            ml: { xs: 2, md: 6, lg: 10 },
            mr: { xs: 2, md: 6, lg: 15 },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: darkMode ? "white" : "black",
            }}
          >
            <FolderIcon sx={{ color: "#1976d2", fontSize: 35 }} /> Projects
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ mr: 2, color: "inherit" }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button
              variant="outlined"
              onClick={logout}
              sx={{ color: "inherit", borderColor: "rgba(128,128,128,0.5)" }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            ml: { xs: 2, md: 6, lg: 10 },
            mr: { xs: 2, md: 6, lg: 15 },
            mb: 8,
          }}
        >
          <Grid container spacing={3}>
            {[
              {
                label: "TOTAL",
                value: totalProjects,
                color: "#1976d2",
                icon: <FolderIcon />,
              },
              {
                label: "COMPLETED",
                value: completedProjects,
                color: "#4caf50",
                icon: <CheckIcon />,
              },
              {
                label: "IN PROGRESS",
                value: inProgressProjects,
                color: "#ff9800",
                icon: <ProgressIcon />,
              },
            ].map((stat, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  sx={{
                    ...glassStyle,
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: subTextColor, fontWeight: "bold" }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ my: 0.5 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: stat.color }}
                  >
                    {stat.icon}
                  </Avatar>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            ml: { xs: 2, md: 6, lg: 10 },
            mr: { xs: 2, md: 6, lg: 20 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            px={1}
          >
            <Box display="flex" gap={1}>
              {["all", "pending", "in-progress", "completed"].map((val) => (
                <Button
                  key={val}
                  onClick={() => setFilter(val)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "capitalize",
                    color: filter === val ? "#1976d2" : subTextColor,
                    bgcolor:
                      filter === val ? "rgba(25,118,210,0.1)" : "transparent",
                  }}
                >
                  {val === "all" ? "All Projects" : val.replace("-", " ")}
                </Button>
              ))}
            </Box>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              variant="standard"
              sx={{ color: "inherit" }}
            >
              <MenuItem value="due_date_asc">Newest</MenuItem>
              <MenuItem value="due_date_desc">Oldest</MenuItem>
            </Select>
          </Box>

          <Grid container spacing={4}>
            {tasks.map((task) => (
              <Grid item xs={12} md={6} key={task.id}>
                <Card
                  sx={{
                    ...glassStyle,
                    display: "flex",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 4 }}>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        bgcolor:
                          task.status === "completed"
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(25, 118, 210, 0.1)",
                        color:
                          task.status === "completed" ? "#81c784" : "#64b5f6",
                      }}
                    />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: subTextColor, mb: 4, minHeight: "40px" }}
                    >
                      {task.description || "Project details..."}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography
                        variant="caption"
                        sx={{ color: subTextColor }}
                      >
                        Progress
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        65%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{ height: 6, borderRadius: 3, mb: 4 }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <AvatarGroup max={2}>
                        <Avatar sx={{ width: 28, height: 28 }} />
                        <Avatar sx={{ width: 28, height: 28 }} />
                      </AvatarGroup>

                      <Box display="flex" gap={1}>
                        {!isAdmin && (
                          <IconButton
                            onClick={() => navigate(`/tasks/${task.id}/edit`)}
                            sx={{ color: "inherit" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => deleteTask(task.id)}
                          sx={{ color: "#ef5350" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/tasks/${task.id}/edit`)}
                          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
                        >
                          Details
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      width: { xs: 0, sm: 100 },
                      background: darkMode
                        ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%)"
                        : "linear-gradient(135deg, #eab7c822 0%, rgba(0,0,0,0.03) 100%)",
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FolderIcon sx={{ fontSize: 40, opacity: 0.05 }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Floating "New Task" button */}
        {!isAdmin && (
          <Box sx={{ position: "fixed", bottom: 40, right: 60, zIndex: 1000 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/tasks/new")}
              sx={{
                borderRadius: 10,
                px: 4,
                py: 2,
                fontWeight: "bold",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                textTransform: "none",
              }}
            >
              New Task
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TaskList;
