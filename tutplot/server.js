const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const authRoutes = require("./routers/auth");
const studentRoutes = require("./routers/studentRoutes");
const attendanceRoutes = require("./routers/attendanceRoutes");
const examRoutes = require("./routers/examRoutes");
const feesRoutes = require("./routers/feesRoutes");
const staffRoutes = require("./routers/staffRoutes");
const timetableRoutes = require("./routers/timetableRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // Moved auth routes under /api/auth
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/timetable", timetableRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

