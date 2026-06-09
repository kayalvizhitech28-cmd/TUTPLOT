const { createExam } = require("./models/examModel");

const payload = {
  student: "Ravi",
  class_name: "10th",
  exam: "Midterm",
  date: "2023-10-01",
  subjects: [
    { subject: "Tamil", code: "TAM1001", mark: "90" },
    { subject: "English", code: "ENG1001", mark: "85" }
  ]
};

async function test() {
  try {
    console.log("Testing createExam (mark_table01)...");
    await createExam(payload);
    console.log("Success!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

test();

