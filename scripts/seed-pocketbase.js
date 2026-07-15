import PocketBase from 'pocketbase';
import readline from 'readline';

const pb = new PocketBase('http://127.0.0.1:8090');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("==========================================");
  console.log("⛵ SailorPrep PocketBase Automator");
  console.log("==========================================");
  console.log("This script will create the database schema and insert dummy data.\n");
  console.log("⚠️ Make sure you have created an Admin account by visiting http://127.0.0.1:8090/_/ first!\n");

  const email = await question("Enter your PocketBase Admin Email [admin@sailorprep.com]: ") || "admin@sailorprep.com";
  const password = await question("Enter your PocketBase Admin Password [admin123456]: ") || "admin123456";

  try {
    console.log(`\nAuthenticating as ${email}...`);
    await pb.admins.authWithPassword(email, password);
    console.log("✅ Authenticated successfully.\n");
  } catch (err) {
    console.error("❌ Authentication failed. Make sure your email and password are correct, and PocketBase is running.");
    console.error(err.message);
    process.exit(1);
  }

  // Define Schema
  const collections = [
    {
      name: "activities",
      type: "base",
      schema: [
        { name: "action", type: "text", required: true },
        { name: "target", type: "text", required: true },
        { name: "time", type: "text", required: true },
        { name: "icon", type: "text", required: false },
        { name: "status", type: "text", required: false }
      ]
    },
    {
      name: "batches",
      type: "base",
      schema: [
        { name: "title", type: "text", required: true },
        { name: "type", type: "text", required: true },
        { name: "capacity", type: "number", required: true },
        { name: "enrolled", type: "number", required: true },
        { name: "status", type: "text", required: true },
        { name: "start_date", type: "date", required: true }
      ]
    },
    {
      name: "study_notes",
      type: "base",
      schema: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "category", type: "text", required: true }
      ]
    },
    {
      name: "mock_tests",
      type: "base",
      schema: [
        { name: "title", type: "text", required: true },
        { name: "duration_mins", type: "number", required: true },
        { name: "total_questions", type: "number", required: true },
        { name: "difficulty", type: "text", required: true },
        { name: "category", type: "text", required: true },
        { name: "is_pro", type: "bool", required: false }
      ]
    },
    {
      name: "interview_prep",
      type: "base",
      schema: [
        { name: "role", type: "text", required: true },
        { name: "company", type: "text", required: true },
        { name: "difficulty", type: "text", required: true },
        { name: "questions_count", type: "number", required: true },
        { name: "success_rate", type: "number", required: true }
      ]
    },
    {
      name: "pyqs",
      type: "base",
      schema: [
        { name: "year", type: "text", required: true },
        { name: "exam_type", type: "text", required: true },
        { name: "subject", type: "text", required: true },
        { name: "difficulty", type: "text", required: true },
        { name: "downloads", type: "number", required: true },
        { name: "status", type: "text", required: true }
      ]
    },
    {
      name: "user_progress",
      type: "base",
      schema: [
        { name: "current_level", type: "number", required: true },
        { name: "total_score", type: "number", required: true },
        { name: "streak_days", type: "number", required: true }
      ]
    }
  ];

  console.log("Building Collections Schema...");
  for (const col of collections) {
    try {
      // Check if exists
      await pb.collections.getOne(col.name);
      console.log(`ℹ️  Collection '${col.name}' already exists.`);
    } catch (e) {
      // Doesn't exist, create it
      console.log(`🔨 Creating collection '${col.name}'...`);
      try {
        await pb.collections.create({
          ...col,
          listRule: "", // Public
          viewRule: "", // Public
          createRule: null, // Admin only
          updateRule: null, // Admin only
          deleteRule: null, // Admin only
        });
        console.log(`✅ Collection '${col.name}' created successfully.`);
      } catch (createErr) {
        console.error(`❌ Failed to create '${col.name}':`, createErr.response?.data || createErr.message);
      }
    }
  }

  console.log("\nSeeding dummy data...");

  // Dummy Data Insertion
  const seedData = {
    activities: [
      { action: "Course Completed", target: "Advanced Ship Stability", time: "2 hours ago", icon: "BookOpen", status: "success" },
      { action: "Mock Test Submitted", target: "Navigation Rules Exam", time: "5 hours ago", icon: "CheckCircle", status: "warning" },
      { action: "New Batch Enrolled", target: "Deck Cadet Fast-track", time: "1 day ago", icon: "Users", status: "info" }
    ],
    batches: [
      { title: "Deck Cadet Fast-track 2026", type: "Navigation", capacity: 50, enrolled: 42, status: "Active", start_date: new Date().toISOString() },
      { title: "Engine Officer Preparatory", type: "Engineering", capacity: 30, enrolled: 30, status: "Full", start_date: new Date().toISOString() }
    ],
    study_notes: [
      { title: "Rule of the Road (COLREGs)", description: "Complete guide to maritime navigation rules and collision avoidance.", category: "Navigation" },
      { title: "Ship Stability Basics", description: "Understanding center of gravity, buoyancy, and metacentric height.", category: "Naval Architecture" }
    ],
    mock_tests: [
      { title: "MMD Phase 1 Grand Mock Test", duration_mins: 180, total_questions: 100, difficulty: "Hard", category: "Comprehensive", is_pro: true },
      { title: "Celestial Navigation Quiz", duration_mins: 45, total_questions: 30, difficulty: "Medium", category: "Navigation", is_pro: false }
    ],
    interview_prep: [
      { role: "Deck Cadet", company: "Maersk Line", difficulty: "Medium", questions_count: 45, success_rate: 68 },
      { role: "Junior Engineer", company: "Fleet Management", difficulty: "Hard", questions_count: 32, success_rate: 54 }
    ],
    pyqs: [
      { year: "2023", exam_type: "MMD Phase 2", subject: "Ship Stability", difficulty: "Hard", downloads: 1245, status: "Verified" },
      { year: "2022", exam_type: "IMU CET", subject: "Physics & Math", difficulty: "Medium", downloads: 3420, status: "Verified" }
    ],
    user_progress: [
      { current_level: 4, total_score: 1250, streak_days: 12 }
    ]
  };

  for (const [collectionName, records] of Object.entries(seedData)) {
    console.log(`Seeding ${collectionName}...`);
    try {
      const existing = await pb.collection(collectionName).getList(1, 1);
      if (existing.totalItems === 0) {
        for (const record of records) {
          await pb.collection(collectionName).create(record);
        }
        console.log(`✅ Seeded ${records.length} records into '${collectionName}'.`);
      } else {
        console.log(`ℹ️  '${collectionName}' already has data, skipping.`);
      }
    } catch (err) {
      console.error(`❌ Error seeding '${collectionName}':`, err.message);
    }
  }

  console.log("\n==========================================");
  console.log("🎉 All done! Your PocketBase is ready.");
  console.log("==========================================");
  rl.close();
}

main();
