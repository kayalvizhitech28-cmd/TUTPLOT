const { createStudent } = require('./models/studentModel');
async function run() {
  try {
    await createStudent({
      Name: "Test Student",
      DateofBirth: "2010-01-01",
      Standard: "10th",
      MotherName: "Test Mother",
      FatherName: "Test Father",
      schoolName: "Test School",
      Address: "Test Address",
      contact: "1234567890",
      fee: "5000"
    });
    console.log("Student created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating student:", err);
    process.exit(1);
  }
}
run();
