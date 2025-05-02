import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, deleteDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const services = [
  {
    category: "Wig Services",
    services: [
      { name: "Installation 5 by 5 closure", price: 10000 },
      { name: "Installation with frontal closure", price: 12000 },
      { name: "Installation 360 frontal closure", price: 15000 },
      { name: "Glueless making", price: 5000 },
      { name: "Wig Revamping", price: 5000 },
      { name: "Wig stretching", price: 2000 },
      { name: "Wig tonging", price: 3000 },
      { name: "Wig trimming", price: 1000 },
      { name: "Band Application", price: 1000 },
      { name: "Loosing of wig and making closure", price: 9000 },
      { name: "Loosing of wig and making frontal", price: 11000 },
      { name: "Ordinary Wig Making Closure", price: 8000 },
      { name: "Ordinary Wig Making frontal", price: 9000 }
    ]
  },
  {
    category: "Adult Natural Weaving",
    services: [
      { name: "Small Size (S/S)", price: 4000 },
      { name: "Medium Size (M/S)", price: 3000 },
      { name: "Big Size (B/S)", price: 2500 },
      { name: "Tiny weaving", price: 6000 }
    ]
  },
  {
    category: "Passion Twist",
    services: [
      { name: "Long S/S", price: 15000 },
      { name: "M/S", price: 13000 },
      { name: "B/S", price: 10000 }
    ]
  },
  {
    category: "Big Weaving with Attachment",
    services: [
      { name: "Two", price: 2500 },
      { name: "Four", price: 4500 },
      { name: "Six", price: 5500 }
    ]
  },
  {
    category: "Big Weaving with Attachment Stitches",
    services: [
      { name: "Two", price: 3500 },
      { name: "Four", price: 6500 },
      { name: "Six", price: 8500 }
    ]
  },
  {
    category: "Adult Hair Retouching",
    services: [
      { name: "Natural hair", price: 6000 },
      { name: "Re-application", price: 4000 }
    ]
  },
  {
    category: "Steaming Services",
    services: [
      { name: "Steaming of hair", price: 5000 },
      { name: "With clients product", price: 3000 }
    ]
  },
  {
    category: "Nail Services",
    services: [
      { name: "Stickon Nails", price: 8500 },
      { name: "Acrylics Nails (Long)", price: 16000 },
      { name: "Acrylics Nails (Short)", price: 14000 },
      { name: "Acrylics Nails (Normal)", price: 12000 },
      { name: "Nails Refill", price: 8000 },
      { name: "Gel polish", price: 2000 },
      { name: "Normal polish", price: 1000 },
      { name: "Pedicure / manicure", price: 7000 },
      { name: "Press on nails with top coat", price: 3000 },
      { name: "Press on nails without top coat", price: 2000 },
      { name: "Nails wrapping", price: 8500 },
      { name: "All Toes Acrylic", price: 7500 },
      { name: "Big toe Acrylic", price: 3500 },
      { name: "Toes Stickon", price: 5500 },
      { name: "Big toe polish", price: 2500 },
      { name: "Dry pedicure", price: 7500 }
    ]
  },
  {
    category: "Coco Twist",
    services: [
      { name: "S/S", price: 16000 },
      { name: "M/S", price: 14000 },
      { name: "B/S", price: 12000 }
    ]
  },
  {
    category: "Children's Services",
    services: [
      { name: "Stitches weaving with natural hair S/S", price: 5000 },
      { name: "Stitches weaving with natural hair M/S", price: 4000 },
      { name: "Stitches weaving with natural hair B/S", price: 3500 },
      { name: "Stitches braids with attachment S/S", price: 10000 },
      { name: "Stitches braids with attachment M/S", price: 8500 },
      { name: "Stitches braids with attachment B/S", price: 6500 },
      { name: "Packing gel with retouch hair", price: 5000 },
      { name: "Packing gel with natural hair", price: 6000 }
    ]
  },
  {
    category: "Natural Hair Twist",
    services: [
      { name: "S/S", price: 8000 },
      { name: "M/S", price: 7000 },
      { name: "B/S", price: 5000 }
    ]
  },
  {
    category: "Removal Services",
    services: [
      { name: "Children Removal of Braids extension S/S", price: 2500 },
      { name: "Children Removal of Braids extension M/S", price: 2000 },
      { name: "Children Removal of Braids extension B/S", price: 1500 },
      { name: "Adult Removal of Braids extension S/S", price: 3000 },
      { name: "Adult Removal of Braids extension M/S", price: 2500 },
      { name: "Adult Removal of Braids extension B/S", price: 2000 }
    ]
  },
  {
    category: "Loosening Services",
    services: [
      { name: "Stitches loosening S/S", price: 1500 },
      { name: "Stitches loosening M/S", price: 2000 },
      { name: "Stitches loosening B/S", price: 2500 },
      { name: "Ghana Weaving S/S", price: 2500 },
      { name: "Ghana Weaving M/S", price: 2000 },
      { name: "Ghana Weaving B/S", price: 1500 },
      { name: "School weaving S/S", price: 1500 },
      { name: "School weaving M/S", price: 1000 },
      { name: "School weaving B/S", price: 500 }
    ]
  },
  {
    category: "Lash Services",
    services: [
      { name: "Fixing of clients lashes stripe", price: 1500 },
      { name: "Fixing of clients lashes single", price: 3000 },
      { name: "Fixing of salon lashes stripe", price: 5500 },
      { name: "Fixing of salon lashes single", price: 8000 }
    ]
  },
  {
    category: "Children School Services",
    services: [
      { name: "School weaving with natural hair", price: 4000 },
      { name: "School weaving with natural hair M/S", price: 2000 },
      { name: "School weaving with natural hair B/S", price: 2500 },
      { name: "Weaving with attachment S/S", price: 6500 },
      { name: "Weaving with attachment M/S", price: 5500 },
      { name: "Weaving with attachment B/S", price: 4500 }
    ]
  },
  {
    category: "Baby-face Services",
    services: [
      { name: "With Natural hair S/S", price: 7000 },
      { name: "With Natural hair M/S", price: 6000 },
      { name: "With Natural hair B/S", price: 5500 },
      { name: "With attachment Long", price: 16000 },
      { name: "With attachment Medium", price: 14000 },
      { name: "With attachment Big and short", price: 10000 }
    ]
  },
  {
    category: "Special Braiding Services",
    services: [
      { name: "Knotless braids S/S", price: 18000 },
      { name: "Knotless braids M/S", price: 16000 },
      { name: "Knotless braids B/S", price: 12000 },
      { name: "Extra long knotless with other attachment", price: 25000 },
      { name: "Stitches braids single", price: 14000 },
      { name: "Stitches braids single S/S", price: 10000 },
      { name: "Stitches braids single M/S", price: 8500 }
    ]
  },
  {
    category: "Special Styles",
    services: [
      { name: "Goddes Braids S/S", price: 20000 },
      { name: "Goddes Braids M/S", price: 18000 },
      { name: "Bohho Braids long S/S", price: 25000 },
      { name: "Bohho Braids short S/S", price: 16000 },
      { name: "Butterfly twist S/S", price: 18000 },
      { name: "Butterfly twist M/S", price: 16000 }
    ]
  },
  {
    category: "Matting Services",
    services: [
      { name: "S/S", price: 6000 },
      { name: "M/S", price: 5000 },
      { name: "B/S", price: 4000 }
    ]
  },
  {
    category: "Beauty Services",
    services: [
      { name: "Facials", price: 10000 },
      { name: "Make-up", price: 10000 },
      { name: "Make-up and gele", price: 12000 },
      { name: "Micro blading and shading", price: 50000 },
      { name: "Body piercing with salon ring", price: 10500 },
      { name: "Semi permanent eye lashes Classic", price: 15000 },
      { name: "Semi permanent eye lashes Volume", price: 25000 },
      { name: "Semi permanent eye lashes Mega volume", price: 30000 },
      { name: "Eye piercing", price: 10500 },
      { name: "Nose piercing", price: 10500 }
    ]
  },
  {
    category: "Additional Services",
    services: [
      { name: "Semi dread lock or comb twist", price: 20000 },
      { name: "Weave crotchet B/S", price: 7500 },
      { name: "Weave crotchet M/S", price: 8500 },
      { name: "Weave crotchet S/S", price: 10500 },
      { name: "Single crotchet", price: 12000 },
      { name: "Washing", price: 3000 },
      { name: "Packing of dread", price: 2000 },
      { name: "Styling of hair", price: 1500 },
      { name: "Half packing gel", price: 2500 },
      { name: "Packing gel", price: 5500 },
      { name: "Water melon braids", price: 15000 }
    ]
  },
  {
    category: "Lock Services",
    services: [
      { name: "Ladies lock twist S/S", price: 35000 },
      { name: "Ladies lock twist M/S", price: 30000 },
      { name: "Ladies lock twist B/S", price: 25000 },
      { name: "Removal of ladies lock extension", price: 9000 },
      { name: "Jerry curl making", price: 20000 }
    ]
  },
  {
    category: "Wool Services",
    services: [
      { name: "S/S and long", price: 20000 },
      { name: "M/S and long", price: 18000 },
      { name: "B/S and long", price: 16000 },
      { name: "S/S and short", price: 16000 },
      { name: "M/S and short", price: 14000 },
      { name: "B/S and short", price: 10000 }
    ]
  },
  {
    category: "Special Hair Services",
    services: [
      { name: "Weaving with kinky S/S", price: 6000 },
      { name: "Weaving with kinky M/S", price: 5000 },
      { name: "Weaving with kinky B/S", price: 4000 },
      { name: "Butterfly lock", price: 18000 },
      { name: "Dye application: Full with client dye", price: 6000 },
      { name: "Dye application: Full with salon kits", price: 8000 },
      { name: "Highlighting with salon kits", price: 14000 },
      { name: "Relocking of dread: full with washing", price: 10000 },
      { name: "½ dread lock with washing", price: 10000 },
      { name: "Fresh dread making: full with washing", price: 30000 },
      { name: "Fresh Dread lock ½ with washing", price: 25000 }
    ]
  }
];

const addServices = async () => {
  try {
    // First, clear existing services
    const servicesRef = collection(db, 'services');
    const existingServices = await getDocs(servicesRef);
    const deletePromises = existingServices.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('Cleared existing services');

    // Add new services
    const addPromises = services.map(async (category) => {
      const categoryRef = await addDoc(collection(db, 'services'), {
        category: category.category,
        services: category.services
      });
      console.log(`Added category: ${category.category}`);
      return categoryRef;
    });

    await Promise.all(addPromises);
    console.log('All services added successfully');
  } catch (error) {
    console.error('Error adding services:', error);
  }
};

// Execute the function
addServices(); 