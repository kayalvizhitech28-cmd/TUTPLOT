const { getAllFeess } = require('./models/feesModel');
async function run() {
  try {
    const res = await getAllFeess();
    console.log(res);
    process.exit(0);
  } catch (err) {
    console.error("Error getting fees:", err);
    process.exit(1);
  }
}
run();
