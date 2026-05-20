const { createAttendance } = require("./models/attendanceModel");

const payload = {
  form: {
    standard: "10th",
    date: "2023-10-05",
    staff: "Mr. Smith"
  },
  students: [
    { id: 1, name: "Student 1", status: "present" },
    { id: 2, name: "Student 2", status: "absent" }
  ]
};

async function test() {
  try {
    console.log("Testing createAttendance...");
    await createAttendance(payload);
    console.log("Success!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

test();
