const { createTimetable } = require("./models/timetableModel");

const payload = {
  class_name: "10th",
  schedule: [
    { day: "Monday", subject_code: "TAM1001", subject: "Tamil", staff: "John" }
  ]
};

async function test() {
  try {
    console.log("Testing createTimetable...");
    await createTimetable(payload);
    console.log("Success!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

test();
