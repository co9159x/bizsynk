import { addMultipleStaff, clearStaffCollection } from '../src/lib/firebase/services.js';

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

const staffData = [
  ...barbers.map(name => ({
    name,
    role: "Barber" as const,
    email: null,
    phone: null,
    status: "out" as const,
    lastClockIn: null,
    lastClockOut: null,
    category: "Barbers"
  })),
  ...stylists.map(name => ({
    name,
    role: "Stylist" as const,
    email: null,
    phone: null,
    status: "out" as const,
    lastClockIn: null,
    lastClockOut: null,
    category: "Stylists"
  }))
];

async function main() {
  try {
    console.log('Starting staff data addition...');
    
    // Clear existing staff
    await clearStaffCollection();
    
    // Add new staff
    await addMultipleStaff(staffData);
    console.log('Staff data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding staff data:', error);
    process.exit(1);
  }
}

main(); 