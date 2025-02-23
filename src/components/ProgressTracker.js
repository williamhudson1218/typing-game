import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Check as AccuracyIcon,
  Timer as TimeIcon,
  EmojiEvents as CompletedIcon,
} from "@mui/icons-material";
import { getStats } from "../utils/statsManager";

const ProgressTracker = () => {
  const stats = getStats();

  const StatCard = ({ title, value, icon, unit }) => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
          {typeof value === "number" ? value.toFixed(1) : value}
          {unit && (
            <Typography
              component="span"
              variant="body1"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {unit}
            </Typography>
          )}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Progress Tracker
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Words Typed"
            value={stats.wordsTyped}
            icon={<SpeedIcon color="primary" />}
            unit="words"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accuracy"
            value={stats.accuracy}
            icon={<AccuracyIcon color="primary" />}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Speed"
            value={stats.averageSpeed}
            icon={<TimeIcon color="primary" />}
            unit="WPM"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lessons Completed"
            value={stats.lessonsCompleted}
            icon={<CompletedIcon color="primary" />}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(stats.lessonsCompleted / 10) * 100} // Assuming 10 lessons is 100%
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Paper>
    </Box>
  );
};

export default ProgressTracker;
