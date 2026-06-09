const { createTimetable, getAllTimetables } = require('./models/timetableModel');
async function run() {
  try {
    await createTimetable({
      class_name: "11th - Bio Maths",
      schedule: [
        { day: "Monday", subject_code: "BIO01", subject: "Biology", staff: "Mr. B" }
      ]
    });
    console.log("Created 11th - Bio Maths");

    await createTimetable({
      class_name: "11th - Computer Science",
      schedule: [
        { day: "Monday", subject_code: "CS01", subject: "Computer", staff: "Mr. C" }
      ]
    });
    console.log("Created 11th - Computer Science");

    const t = await getAllTimetables();
    console.log(t);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

