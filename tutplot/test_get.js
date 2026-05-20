const { getAllStudents } = require('./models/studentModel');
async function run() {
  try {
    const students = await getAllStudents();
    console.log(students);
    process.exit(0);
  } catch (err) {
    console.error("Error getting students:", err);
    process.exit(1);
  }
}
run();
