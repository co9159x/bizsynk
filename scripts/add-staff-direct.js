const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "bizsynk-7737e",
    clientEmail: "firebase-adminsdk-fbsvc@bizsynk-7737e.iam.gserviceaccount.com",
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);

const cashiers = [
  "John Smith",
  "Jane Doe",
  "Michael Johnson",
  "Sarah Williams"
];

const supervisors = [
  "Robert Brown",
  "Emily Davis",
  "David Wilson"
];

const managers = [
  "Jennifer Taylor",
  "James Anderson"
];

async function addStaff() {
  try {
    const batch = db.batch();
    const staffCollection = db.collection('staff');

    // Add cashiers
    cashiers.forEach((name, index) => {
      const docRef = staffCollection.doc();
      batch.set(docRef, {
        name,
        role: "Cashier",
        email: name.toLowerCase().replace(/\s+/g, '.') + "@bizsynk.com",
        phone: `+234 123 456 ${7890 + index}`,
        status: "out",
        lastClockIn: null,
        lastClockOut: null,
        category: "Cashiers"
      });
    });

    // Add supervisors
    supervisors.forEach((name, index) => {
      const docRef = staffCollection.doc();
      batch.set(docRef, {
        name,
        role: "Supervisor",
        email: name.toLowerCase().replace(/\s+/g, '.') + "@bizsynk.com",
        phone: `+234 123 456 ${7919 + index}`,
        status: "out",
        lastClockIn: null,
        lastClockOut: null,
        category: "Supervisors"
      });
    });

    // Add managers
    managers.forEach((name, index) => {
      const docRef = staffCollection.doc();
      batch.set(docRef, {
        name,
        role: "Manager",
        email: name.toLowerCase().replace(/\s+/g, '.') + "@bizsynk.com",
        phone: `+234 123 456 ${7930 + index}`,
        status: "out",
        lastClockIn: null,
        lastClockOut: null,
        category: "Managers"
      });
    });

    await batch.commit();
    console.log('Successfully added all staff members');
  } catch (error) {
    console.error('Error adding staff:', error);
  }
}

addStaff().then(() => process.exit()); 