import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "bizsynk-7737e",
    clientEmail: "firebase-adminsdk-fbsvc@bizsynk-7737e.iam.gserviceaccount.com",
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY
  })
});

const db = getFirestore(app);

// Services data
const servicesData = [
  {
    category: "Wig Services",
    services: [
      { name: "Installation 5 by 5 closure" },
      { name: "Installation with frontal closure" },
      { name: "Installation 360 frontal closure" },
      { name: "Glueless making" },
      { name: "Wig Revamping" },
      { name: "Wig stretching" },
      { name: "Wig tonging" },
      { name: "Wig trimming" },
      { name: "Band Application" },
      { name: "Loosing of wig and making closure" },
      { name: "Loosing of wig and making frontal" },
      { name: "Ordinary Wig Making Closure" },
      { name: "Ordinary Wig Making frontal" }
    ]
  },
  {
    category: "Adult Natural Weaving",
    services: [
      { name: "Small Size (S/S)" },
      { name: "Medium Size (M/S)" },
      { name: "Big Size (B/S)" },
      { name: "Tiny weaving" }
    ]
  },
  {
    category: "Passion Twist",
    services: [
      { name: "Long S/S" },
      { name: "M/S" },
      { name: "B/S" }
    ]
  },
  {
    category: "Big Weaving with Attachment",
    services: [
      { name: "Two" },
      { name: "Four" },
      { name: "Six" }
    ]
  },
  {
    category: "Big Weaving with Attachment Stitches",
    services: [
      { name: "Two" },
      { name: "Four" },
      { name: "Six" }
    ]
  },
  {
    category: "Adult Hair Retouching",
    services: [
      { name: "Natural hair" },
      { name: "Re-application" }
    ]
  },
  {
    category: "Steaming Services",
    services: [
      { name: "Steaming of hair" },
      { name: "With clients product" }
    ]
  },
  {
    category: "Nail Services",
    services: [
      { name: "Stickon Nails" },
      { name: "Acrylics Nails (Long)" },
      { name: "Acrylics Nails (Short)" },
      { name: "Acrylics Nails (Normal)" },
      { name: "Nails Refill" },
      { name: "Gel polish" },
      { name: "Normal polish" },
      { name: "Pedicure / manicure" },
      { name: "Press on nails with top coat" },
      { name: "Press on nails without top coat" },
      { name: "Nails wrapping" },
      { name: "All Toes Acrylic" },
      { name: "Big toe Acrylic" },
      { name: "Toes Stickon" },
      { name: "Big toe polish" },
      { name: "Dry pedicure" }
    ]
  },
  {
    category: "Coco Twist",
    services: [
      { name: "S/S" },
      { name: "M/S" },
      { name: "B/S" }
    ]
  },
  {
    category: "Children's Services",
    services: [
      { name: "Stitches weaving with natural hair S/S" },
      { name: "Stitches weaving with natural hair M/S" },
      { name: "Stitches weaving with natural hair B/S" },
      { name: "Stitches braids with attachment S/S" },
      { name: "Stitches braids with attachment M/S" },
      { name: "Stitches braids with attachment B/S" },
      { name: "Packing gel with retouch hair" },
      { name: "Packing gel with natural hair" },
      { name: "Natural Hair Twist S/S" },
      { name: "Natural Hair Twist M/S" },
      { name: "Natural Hair Twist B/S" }
    ]
  },
  {
    category: "Removal Services",
    services: [
      { name: "Children Removal of Braids extension S/S" },
      { name: "Children Removal of Braids extension M/S" },
      { name: "Children Removal of Braids extension B/S" },
      { name: "Adult Removal of Braids extension S/S" },
      { name: "Adult Removal of Braids extension M/S" },
      { name: "Adult Removal of Braids extension B/S" }
    ]
  },
  {
    category: "Loosening Services",
    services: [
      { name: "Stitches loosening S/S" },
      { name: "Stitches loosening M/S" },
      { name: "Stitches loosening B/S" },
      { name: "Ghana Weaving S/S" },
      { name: "Ghana Weaving M/S" },
      { name: "Ghana Weaving B/S" },
      { name: "School weaving S/S" },
      { name: "School weaving M/S" },
      { name: "School weaving B/S" }
    ]
  },
  {
    category: "Lash Services",
    services: [
      { name: "Fixing of clients lashes stripe" },
      { name: "Fixing of clients lashes single" },
      { name: "Fixing of salon lashes stripe" },
      { name: "Fixing of salon lashes single" }
    ]
  },
  {
    category: "Children School Services",
    services: [
      { name: "School weaving with natural hair" },
      { name: "School weaving with natural hair M/S" },
      { name: "School weaving with natural hair B/S" },
      { name: "Weaving with attachment S/S" },
      { name: "Weaving with attachment M/S" },
      { name: "Weaving with attachment B/S" }
    ]
  },
  {
    category: "Baby-face Services",
    services: [
      { name: "With Natural hair S/S" },
      { name: "With Natural hair M/S" },
      { name: "With Natural hair B/S" },
      { name: "With attachment Long" },
      { name: "With attachment Medium" },
      { name: "With attachment Big and short" }
    ]
  },
  {
    category: "Special Braiding Services",
    services: [
      { name: "Knotless braids S/S" },
      { name: "Knotless braids M/S" },
      { name: "Knotless braids B/S" },
      { name: "Extra long knotless with other attachment" },
      { name: "Stitches braids single" },
      { name: "Stitches braids single S/S" },
      { name: "Stitches braids single M/S" }
    ]
  },
  {
    category: "Special Styles",
    services: [
      { name: "Goddes Braids S/S" },
      { name: "Goddes Braids M/S" },
      { name: "Bohho Braids long S/S" },
      { name: "Bohho Braids short S/S" },
      { name: "Butterfly twist S/S" },
      { name: "Butterfly twist M/S" }
    ]
  },
  {
    category: "Matting Services",
    services: [
      { name: "S/S" },
      { name: "M/S" },
      { name: "B/S" }
    ]
  },
  {
    category: "Beauty Services",
    services: [
      { name: "Facials" },
      { name: "Make-up" },
      { name: "Make-up and gele" },
      { name: "Micro blading and shading" },
      { name: "Body piercing with salon ring" },
      { name: "Semi permanent eye lashes Classic" },
      { name: "Semi permanent eye lashes Volume" },
      { name: "Semi permanent eye lashes Mega volume" },
      { name: "Eye piercing" },
      { name: "Nose piercing" }
    ]
  },
  {
    category: "Additional Services",
    services: [
      { name: "Semi dread lock or comb twist" },
      { name: "Weave crotchet B/S" },
      { name: "Weave crotchet M/S" },
      { name: "Weave crotchet S/S" },
      { name: "Single crotchet" },
      { name: "Washing" },
      { name: "Packing of dread" },
      { name: "Styling of hair" },
      { name: "Half packing gel" },
      { name: "Packing gel" },
      { name: "Water melon braids" }
    ]
  },
  {
    category: "Lock Services",
    services: [
      { name: "Ladies lock twist S/S" },
      { name: "Ladies lock twist M/S" },
      { name: "Ladies lock twist B/S" },
      { name: "Removal of ladies lock extension" },
      { name: "Jerry curl making" }
    ]
  },
  {
    category: "Wool Services",
    services: [
      { name: "S/S and long" },
      { name: "M/S and long" },
      { name: "B/S and long" },
      { name: "S/S and short" },
      { name: "M/S and short" },
      { name: "B/S and short" }
    ]
  },
  {
    category: "Special Hair Services",
    services: [
      { name: "Weaving with kinky S/S" },
      { name: "Weaving with kinky M/S" },
      { name: "Weaving with kinky B/S" },
      { name: "Butterfly lock" },
      { name: "Dye application: Full with client dye" },
      { name: "Dye application: Full with salon kits" },
      { name: "Highlighting with salon kits" },
      { name: "Relocking of dread: full with washing" },
      { name: "½ dread lock with washing" },
      { name: "Fresh dread making: full with washing" },
      { name: "Fresh Dread lock ½ with washing" }
    ]
  }
];

// Flatten services data
const flattenedServices = servicesData.flatMap(category => 
  category.services.map(service => ({
    name: service.name,
    category: category.category,
    createdAt: new Date()
  }))
);

async function main() {
  try {
    console.log('Starting services data addition...');
    
    // Clear existing services
    console.log('Clearing services collection...');
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Services collection cleared successfully');
    
    // Add new services
    console.log('Adding new services...');
    const newBatch = db.batch();
    
    flattenedServices.forEach(service => {
      const docRef = servicesRef.doc();
      newBatch.set(docRef, service);
    });
    
    await newBatch.commit();
    console.log('Services data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding services data:', error);
    process.exit(1);
  }
}

main(); 