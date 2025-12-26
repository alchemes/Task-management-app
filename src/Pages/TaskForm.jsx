import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTasks } from "../Context/TasksContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";

const TaskForm = ({ darkMode }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { tasks, createTask, updateTask } = useTasks();
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = role === "admin";
  const isEdit = !!id;
  const isViewOnly = isAdmin && isEdit;

  const selectedTimeSlot = watch("timeSlot");
  const currentStatus = watch("status") || "pending";

  const ALL_TIME_SLOTS = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  const glassStyle = {
    background: darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(12px)",
    border: darkMode
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: 4,
    color: darkMode ? "white" : "#1a1a1c",
    p: 4,
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
  };

  const occupiedSlots = tasks
    .filter((task) => task.id !== id)
    .map((task) => task.timeSlot)
    .filter(Boolean);

  useEffect(() => {
    if (isEdit) {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("status", task.status);
        setValue("due_date", task.due_date || "");
        setValue("timeSlot", task.timeSlot || "");
      }
    }
  }, [id, tasks, setValue, isEdit]);

  const onSubmit = async (data) => {
    if (isEdit) {
      await updateTask(id, data);
    } else {
      await createTask(data);
    }
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2, color: darkMode ? "white" : "black" }}
      >
        Back to Projects
      </Button>

      <Paper sx={glassStyle}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {isViewOnly ? "Task Details" : isEdit ? "Edit Task" : "Create Task"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 4 }}>
          {isViewOnly
            ? "Viewing project milestones as admin"
            : "Fill in the details below"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            {...register("title", {
              required: isViewOnly ? false : "Required",
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isViewOnly}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            {...register("description")}
            disabled={isViewOnly}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal" disabled={isViewOnly}>
            <InputLabel shrink>Status</InputLabel>
            <Select
              value={currentStatus}
              label="Status"
              {...register("status", { required: !isViewOnly })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("due_date")}
            disabled={isViewOnly}
          />

          <FormControl
            fullWidth
            margin="normal"
            disabled={isViewOnly}
            error={!!errors.timeSlot}
          >
            <InputLabel
              id="time-slot-label"
              shrink={!!selectedTimeSlot || true}
            >
              Time Slot
            </InputLabel>
            <Select
              labelId="time-slot-label"
              label="Time Slot"
              {...register("timeSlot")}
              value={selectedTimeSlot || ""}
              displayEmpty
              onChange={(e) => setValue("timeSlot", e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span style={{ opacity: 0.6 }}>Select a time slot</span>
                  );
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ALL_TIME_SLOTS.map((slot) => {
                const isOccupied = occupiedSlots.includes(slot);
                const isOwnSlot =
                  isEdit && tasks.find((t) => t.id === id)?.timeSlot === slot;

                return (
                  <MenuItem
                    key={slot}
                    value={slot}
                    disabled={isOccupied && !isOwnSlot && !isViewOnly}
                  >
                    {slot} {isOccupied && !isOwnSlot && " (Occupied)"}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {occupiedSlots.length === ALL_TIME_SLOTS.length &&
            !isEdit &&
            !selectedTimeSlot && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 1, display: "block" }}
              >
                All time slots are currently occupied.
              </Typography>
            )}

          {!isViewOnly && (
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
              }}
            >
              {isEdit ? "Save Changes" : "Create Task"}
            </Button>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default TaskForm;
