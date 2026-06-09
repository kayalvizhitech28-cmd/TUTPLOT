const { createStudent } = require('./models/studentModel');
async function run() {
  try {
    await createStudent({
      Name: "Test Student with Group",
      DateofBirth: "2008-05-15",
      Standard: "12th",
      Group: "Computer Science",
      MotherName: "Test Mother",
      FatherName: "Test Father",
      schoolName: "Test School",
      Address: "Test Address",
      contact: "1234567890",
      fee: "15,500"
    });
    console.log("Student created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating student:", err);
    process.exit(1);
  }
}
run();

