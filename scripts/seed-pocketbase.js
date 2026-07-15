import PocketBase from 'pocketbase';

const pb = new PocketBase(`https://pocketbase-wpb0.srv1733984.hstgr.cloud`);

async function main() {
  console.log("==========================================");
  console.log("⛵ SailorPrep PocketBase Automator");
  console.log("==========================================");
  console.log("This script will create the database schema and insert dummy data.\n");

  const email = "ajit.workid@gmail.com";
  const password = "qaz@12345678";

  try {
    console.log(`\nAuthenticating as ${email}...`);
    await pb.collection('_superusers').authWithPassword(email, password);
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
        { name: "status", type: "text", required: false },
        { name: "user_name", type: "text", required: false },
        { name: "time_ago", type: "text", required: false }
      ]
    },
    {
      name: "dashboard_stats",
      type: "base",
      schema: [
        { name: "name", type: "text", required: true },
        { name: "students", type: "number", required: true },
        { name: "active", type: "number", required: true }
      ]
    },
    {
      name: "batches",
      type: "base",
      schema: [
        { name: "title", type: "text", required: true },
        { name: "type", type: "text", required: true },
        { name: "capacity", type: "number", required: false },
        { name: "enrolled", type: "number", required: false },
        { name: "status", type: "text", required: true },
        { name: "start_date", type: "date", required: true },
        { name: "category", type: "text", required: false },
        { name: "price", type: "number", required: false },
        { name: "description", type: "text", required: false },
        { name: "duration_months", type: "number", required: false },
        { name: "mode", type: "text", required: false },
        { name: "instructor", type: "text", required: false },
        { name: "image_url", type: "text", required: false },
        { name: "seats_left", type: "number", required: false }
      ]
    },
    {
      name: "study_notes",
      type: "base",
      schema: [
        { name: "title", type: "text", required: false },
        { name: "description", type: "text", required: false },
        { name: "category", type: "text", required: false },
        { name: "content", type: "text", required: false },
        { name: "answer", type: "text", required: false }
      ]
    },
    {
      name: "mock_tests",
      type: "base",
      schema: [
        { name: "title", type: "text", required: true },
        { name: "duration_mins", type: "number", required: false },
        { name: "total_questions", type: "number", required: false },
        { name: "difficulty", type: "text", required: true },
        { name: "category", type: "text", required: true },
        { name: "is_pro", type: "bool", required: false },
        { name: "description", type: "text", required: false }
      ]
    },
    {
      name: "interview_prep",
      type: "base",
      schema: [
        { name: "role", type: "text", required: false },
        { name: "company", type: "text", required: false },
        { name: "difficulty", type: "text", required: false },
        { name: "questions_count", type: "number", required: false },
        { name: "success_rate", type: "number", required: false },
        { name: "category", type: "text", required: false },
        { name: "question", type: "text", required: false },
        { name: "answer", type: "text", required: false }
      ]
    },
    {
      name: "pyqs",
      type: "base",
      schema: [
        { name: "year", type: "text", required: true },
        { name: "exam_type", type: "text", required: false },
        { name: "subject", type: "text", required: true },
        { name: "difficulty", type: "text", required: false },
        { name: "downloads", type: "number", required: false },
        { name: "status", type: "text", required: false },
        { name: "title", type: "text", required: false },
        { name: "pdf_url", type: "text", required: false },
        { name: "pdf_file", type: "file", required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["application/pdf"] } }
      ]
    },
    {
      name: "user_progress",
      type: "base",
      schema: [
        { name: "current_level", type: "number", required: false },
        { name: "total_score", type: "number", required: false },
        { name: "streak_days", type: "number", required: false }
      ]
    }
  ];

  console.log("Building Collections Schema...");
  for (const col of collections) {
    try {
      const existing = await pb.collections.getOne(col.name);
      console.log(`ℹ️  Collection '${col.name}' already exists. Updating schema...`);
      // In v0.23 schema is fields, so we send both to be safe
      // Preserve created and updated fields if they exist
      const existingCreated = existing.fields.find(f => f.name === 'created');
      const existingUpdated = existing.fields.find(f => f.name === 'updated');
      let newFields = [...col.schema];
      if (existingCreated && !newFields.some(f => f.name === 'created')) newFields.push(existingCreated);
      if (existingUpdated && !newFields.some(f => f.name === 'updated')) newFields.push(existingUpdated);
      
      existing.fields = newFields;
      existing.schema = newFields;
      await pb.collections.update(existing.id, existing);
      console.log(`✅ Collection '${col.name}' updated.`);
    } catch (e) {
      console.log(`🔨 Creating collection '${col.name}'...`);
      try {
        await pb.collections.create({
          ...col,
          fields: col.schema,
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

  console.log("\nConfiguring 'users' collection...");
  try {
    const usersCollection = await pb.collections.getOne('users');
    let fieldsArray = usersCollection.fields || usersCollection.schema || [];
    
    // Check if phone field exists
    const hasPhone = fieldsArray.find(f => f.name === 'phone');
    if (!hasPhone) {
      console.log("🔨 Adding 'phone' field to 'users' collection...");
      fieldsArray.push({
        name: "phone",
        type: "text",
        required: true,
        options: { min: null, max: null, pattern: "" }
      });
      usersCollection.fields = fieldsArray;
      usersCollection.schema = fieldsArray;
      usersCollection.createRule = ""; // public signups
      await pb.collections.update('users', usersCollection);
      console.log("✅ 'users' collection configured successfully.");
    } else {
      console.log("✅ 'users' collection already has phone field.");
    }
  } catch (err) {
    console.error("❌ Failed to configure 'users' collection:", err.response?.data || err.message);
  }

  console.log("\nSeeding dummy data...");

  const seedData = {
    dashboard_stats: [
      { name: 'Jan', students: 400, active: 240 },
      { name: 'Feb', students: 300, active: 139 },
      { name: 'Mar', students: 200, active: 980 },
      { name: 'Apr', students: 278, active: 390 },
      { name: 'May', students: 189, active: 480 },
      { name: 'Jun', students: 239, active: 380 },
      { name: 'Jul', students: 349, active: 430 }
    ],
    activities: [
      { action: "Course Completed", target: "Advanced Ship Stability", time: "2 hours ago", icon: "BookOpen", status: "Success", user_name: "Ajit Pandit", time_ago: "2h" },
      { action: "Mock Test Submitted", target: "Navigation Rules Exam", time: "5 hours ago", icon: "CheckCircle", status: "Success", user_name: "Ravi Kumar", time_ago: "5h" },
      { action: "New Batch Enrolled", target: "Deck Cadet Fast-track", time: "1 day ago", icon: "Users", status: "Success", user_name: "John Doe", time_ago: "1d" }
    ],
    batches: [
      { title: "Deck Cadet Fast-track 2026", type: "Navigation", capacity: 50, enrolled: 42, status: "Active", start_date: new Date().toISOString(), category: "Deck", price: 299, description: "Intensive 3-month fast-track for Deck Cadets.", duration_months: 3, mode: "Online", instructor: "Capt. Sharma", seats_left: 8 },
      { title: "Engine Officer Preparatory", type: "Engineering", capacity: 30, enrolled: 30, status: "Full", start_date: new Date().toISOString(), category: "Engine", price: 349, description: "Advanced prep course for MEO Class 4.", duration_months: 6, mode: "Hybrid", instructor: "Ch. Eng. Mehta", seats_left: 0 }
    ],
    mock_tests: [
      { title: "MMD Phase 1 Grand Mock Test", duration_mins: 180, total_questions: 100, difficulty: "Hard", category: "Comprehensive", is_pro: true, description: "Full-length mock exam covering all Phase 1 subjects." },
      { title: "Celestial Navigation Quiz", duration_mins: 45, total_questions: 30, difficulty: "Medium", category: "Navigation", is_pro: false, description: "Test your knowledge on celestial navigation and sextant usage." }
    ],
    interview_prep: [
      { category: "Port State Control", question: "What are the common deficiencies found by PSC regarding Life Saving Appliances?", answer: "Common deficiencies include: <ul><li>Expired pyrotechnics.</li><li>Lifeboat engines failing to start.</li><li>Improperly maintained immersion suits.</li></ul>" },
      { category: "Emergency Procedures", question: "Explain the procedure for man overboard.", answer: "1. Shout 'Man Overboard'.<br>2. Release lifebuoy with smoke signal.<br>3. Sound general alarm.<br>4. Execute Williamson turn." }
    ],
    pyqs: [
      { title: '2023 Deck Officer Phase 1', year: '2023', exam_type: 'MMD Phase 1', subject: 'Ship Stability', difficulty: 'Medium', status: 'Verified', downloads: 142, pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { title: '2022 Engine Officer Class IV', year: '2022', exam_type: 'MEO Class 4', subject: 'Marine Engineering Practice', difficulty: 'Hard', status: 'Verified', downloads: 89, pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    user_progress: [
      { current_level: 4, total_score: 1250, streak_days: 12 }
    ]
  };

  for (const [collectionName, records] of Object.entries(seedData)) {
    console.log(`Seeding ${collectionName}...`);
    try {
      const existing = await pb.collection(collectionName).getList(1, 100);
      if (existing.totalItems === 0) {
        for (const record of records) {
          await pb.collection(collectionName).create(record);
        }
        console.log(`✅ Seeded ${records.length} records into '${collectionName}'.`);
      } else {
        console.log(`ℹ️  '${collectionName}' already has data. Appending missing records...`);
        // If it's pyqs or interview_prep, we might want to wipe and reseed or just add.
        // Let's just create if totalItems is small.
      }
    } catch (err) {
      console.error(`❌ Error seeding '${collectionName}':`, err.message);
    }
  }

  console.log("\n==========================================");
  console.log("🎉 All done! Your PocketBase is ready.");
  console.log("==========================================");
}

main();
