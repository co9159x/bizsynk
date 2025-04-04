const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "salonsync-7737e",
    clientEmail: "firebase-adminsdk-fbsvc@salonsync-7737e.iam.gserviceaccount.com",
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);

const barbers = [
  "Egunjobi Adewale",
  "Salihu Tenimu",
  "Ogebe Onazi Emmanuel",
  "Mathew Neeyu",
  "Patrick Poore",
  "Woche Emmanuel",
  "Happiness Ogbegbor",
  "Rapheal Ohenhen",
  "Salihu Adashina",
  "Rilwan Amos",
  "Moses Collins",
  "Foloki Richard",
  "Iordye Rhassan",
  "Amedu Mark",
  "Otesi Soibi",
  "Toye Emmanuel",
  "Tahiru Audu",
  "Oyedele Blessing",
  "Yusuf Nanaaishat",
  "Blessing Ajayi",
  "Gabriel Sunday",
  "Chimoses Okpana",
  "Yahaya Peter",
  "Okafor Tanimu",
  "Egunjobi Precious",
  "Abdullahi Mojbello",
  "Ayobami Ayeriti",
  "Dimanyi Esther",
  "Chinweuba Christian"
];

const stylists = [
  "Ene Helen Achimi",
  "Esther Jacob Effiong",
  "Blessing Richard",
  "Rukayat Kadieri",
  "Bilikisu Abudulraheem",
  "Philip Aaron Istifanus",
  "Abigail Adaeze Nwagbara",
  "Funmilayo Olajide",
  "Adeniyi Ruqoyan Omobolanle",
  "Susan Aboh",
  "Hogan Anietie",
  "Glory Michael",
  "Barnabas Obi",
  "John Dorcas",
  "Egwundu Hannah",
  "Eye Tochi",
  "Favour Uchenna Chukwuma",
  "Korkyaa Kumawuese Felicity",
  "Usman",
  "Mercy",
  "Olayinka Rachael"
];

async function addStaff() {
  try {
    const batch = db.batch();
    const staffCollection = db.collection('staff');

    // Add barbers
    barbers.forEach((name, index) => {
      const docRef = staffCollection.doc();
      batch.set(docRef, {
        name,
        role: "Barber",
        email: name.toLowerCase().replace(/\s+/g, '.') + "@salonsync.com",
        phone: `+234 123 456 ${7890 + index}`,
        status: "out",
        lastClockIn: null,
        lastClockOut: null,
        category: "Barbers"
      });
    });

    // Add stylists
    stylists.forEach((name, index) => {
      const docRef = staffCollection.doc();
      batch.set(docRef, {
        name,
        role: "Stylist",
        email: name.toLowerCase().replace(/\s+/g, '.') + "@salonsync.com",
        phone: `+234 123 456 ${7919 + index}`,
        status: "out",
        lastClockIn: null,
        lastClockOut: null,
        category: "Stylists"
      });
    });

    await batch.commit();
    console.log('Successfully added all staff members');
  } catch (error) {
    console.error('Error adding staff:', error);
  }
}

addStaff().then(() => process.exit()); 