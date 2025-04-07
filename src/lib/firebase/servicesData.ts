interface Service {
  name: string;
  price: number;
}

interface ServiceCategory {
  category: string;
  services: Service[];
}

export const servicesData: ServiceCategory[] = [
  {
    category: "Haircuts",
    services: [
      { name: "Men's Haircut", price: 25 },
      { name: "Women's Haircut", price: 35 },
      { name: "Children's Haircut (12 & under)", price: 20 },
      { name: "Senior Haircut (65+)", price: 20 },
      { name: "Bang Trim", price: 10 },
      { name: "Beard Trim", price: 15 },
      { name: "Hair & Beard Combo", price: 35 }
    ]
  },
  {
    category: "Color Services",
    services: [
      { name: "Root Touch-up", price: 65 },
      { name: "Full Color", price: 85 },
      { name: "Highlights", price: 95 },
      { name: "Full Highlights", price: 120 },
      { name: "Balayage", price: 150 },
      { name: "Color Correction", price: 150 },
      { name: "Toner", price: 45 }
    ]
  },
  {
    category: "Styling",
    services: [
      { name: "Blowout", price: 35 },
      { name: "Updo", price: 65 },
      { name: "Bridal Hair", price: 120 },
      { name: "Bridal Party (per person)", price: 75 },
      { name: "Hair Extensions (consultation required)", price: 200 }
    ]
  },
  {
    category: "Treatments",
    services: [
      { name: "Deep Conditioning", price: 30 },
      { name: "Keratin Treatment", price: 150 },
      { name: "Hair Gloss", price: 65 },
      { name: "Scalp Treatment", price: 45 }
    ]
  },
  {
    category: "Nail Services",
    services: [
      { name: "Manicure", price: 25 },
      { name: "Pedicure", price: 35 },
      { name: "Gel Manicure", price: 35 },
      { name: "Gel Pedicure", price: 45 },
      { name: "Nail Repair", price: 5 },
      { name: "Polish Change", price: 15 },
      { name: "Stickon Nails", price: 85 },
      { name: "Acrylics Nails (Long)", price: 160 },
      { name: "Acrylics Nails (Short)", price: 140 },
      { name: "Acrylics Nails (Normal)", price: 120 },
      { name: "Nails Refill", price: 80 },
      { name: "Gel polish", price: 20 },
      { name: "Normal polish", price: 10 },
      { name: "Pedicure / manicure", price: 70 },
      { name: "Press on nails with top coat", price: 30 },
      { name: "Press on nails without top coat", price: 20 },
      { name: "Nails wrapping", price: 85 },
      { name: "All Toes Acrylic", price: 75 },
      { name: "Big toe Acrylic", price: 35 },
      { name: "Toes Stickon", price: 55 },
      { name: "Big toe polish", price: 25 },
      { name: "Dry pedicure", price: 75 }
    ]
  },
  {
    category: "Waxing",
    services: [
      { name: "Eyebrow", price: 15 },
      { name: "Lip", price: 10 },
      { name: "Chin", price: 15 },
      { name: "Full Face", price: 45 },
      { name: "Underarm", price: 20 },
      { name: "Bikini", price: 30 },
      { name: "Brazilian", price: 50 },
      { name: "Leg (half)", price: 35 },
      { name: "Leg (full)", price: 60 }
    ]
  },
  {
    category: "Wig Services",
    services: [
      { name: "Installation 5 by 5 closure", price: 100 },
      { name: "Installation with frontal closure", price: 120 },
      { name: "Installation 360 frontal closure", price: 150 },
      { name: "Glueless making", price: 50 },
      { name: "Wig Revamping", price: 50 },
      { name: "Wig stretching", price: 20 },
      { name: "Wig tonging", price: 30 },
      { name: "Wig trimming", price: 10 },
      { name: "Band Application", price: 10 },
      { name: "Loosing of wig and making closure", price: 90 },
      { name: "Loosing of wig and making frontal", price: 110 },
      { name: "Ordinary Wig Making Closure", price: 80 },
      { name: "Ordinary Wig Making frontal", price: 90 }
    ]
  },
  {
    category: "Adult Natural Weaving",
    services: [
      { name: "Small Size (S/S)", price: 40 },
      { name: "Medium Size (M/S)", price: 30 },
      { name: "Big Size (B/S)", price: 25 },
      { name: "Tiny weaving", price: 60 }
    ]
  },
  {
    category: "Passion Twist",
    services: [
      { name: "Long S/S", price: 150 },
      { name: "M/S", price: 130 },
      { name: "B/S", price: 100 }
    ]
  },
  {
    category: "Big Weaving with Attachment",
    services: [
      { name: "Two", price: 25 },
      { name: "Four", price: 45 },
      { name: "Six", price: 55 }
    ]
  },
  {
    category: "Big Weaving with Attachment Stitches",
    services: [
      { name: "Two", price: 35 },
      { name: "Four", price: 65 },
      { name: "Six", price: 85 }
    ]
  },
  {
    category: "Adult Hair Retouching",
    services: [
      { name: "Natural hair", price: 60 },
      { name: "Re-application", price: 40 }
    ]
  },
  {
    category: "Steaming Services",
    services: [
      { name: "Steaming of hair", price: 50 },
      { name: "With clients product", price: 30 }
    ]
  },
  {
    category: "Coco Twist",
    services: [
      { name: "S/S", price: 160 },
      { name: "M/S", price: 140 },
      { name: "B/S", price: 120 }
    ]
  },
  {
    category: "Children's Services",
    services: [
      { name: "Stitches weaving with natural hair S/S", price: 50 },
      { name: "Stitches weaving with natural hair M/S", price: 40 },
      { name: "Stitches weaving with natural hair B/S", price: 35 },
      { name: "Stitches braids with attachment S/S", price: 100 },
      { name: "Stitches braids with attachment M/S", price: 85 },
      { name: "Stitches braids with attachment B/S", price: 65 },
      { name: "Packing gel with retouch hair", price: 50 },
      { name: "Packing gel with natural hair", price: 60 }
    ]
  },
  {
    category: "Natural Hair Twist",
    services: [
      { name: "S/S", price: 80 },
      { name: "M/S", price: 70 },
      { name: "B/S", price: 50 }
    ]
  },
  {
    category: "Removal Services",
    services: [
      { name: "Children Removal of Braids extension S/S", price: 25 },
      { name: "Children Removal of Braids extension M/S", price: 20 },
      { name: "Children Removal of Braids extension B/S", price: 15 },
      { name: "Adult Removal of Braids extension S/S", price: 30 },
      { name: "Adult Removal of Braids extension M/S", price: 25 },
      { name: "Adult Removal of Braids extension B/S", price: 20 }
    ]
  },
  {
    category: "Loosening Services",
    services: [
      { name: "Stitches loosening S/S", price: 15 },
      { name: "Stitches loosening M/S", price: 20 },
      { name: "Stitches loosening B/S", price: 25 },
      { name: "Ghana Weaving S/S", price: 25 },
      { name: "Ghana Weaving M/S", price: 20 },
      { name: "Ghana Weaving B/S", price: 15 },
      { name: "School weaving S/S", price: 15 },
      { name: "School weaving M/S", price: 10 },
      { name: "School weaving B/S", price: 5 }
    ]
  },
  {
    category: "Lash Services",
    services: [
      { name: "Fixing of clients lashes stripe", price: 15 },
      { name: "Fixing of clients lashes single", price: 30 },
      { name: "Fixing of salon lashes stripe", price: 55 },
      { name: "Fixing of salon lashes single", price: 80 }
    ]
  },
  {
    category: "Children School Services",
    services: [
      { name: "School weaving with natural hair", price: 40 },
      { name: "School weaving with natural hair M/S", price: 20 },
      { name: "School weaving with natural hair B/S", price: 25 },
      { name: "Weaving with attachment S/S", price: 65 },
      { name: "Weaving with attachment M/S", price: 55 },
      { name: "Weaving with attachment B/S", price: 45 }
    ]
  },
  {
    category: "Baby-face Services",
    services: [
      { name: "With Natural hair S/S", price: 70 },
      { name: "With Natural hair M/S", price: 60 },
      { name: "With Natural hair B/S", price: 55 },
      { name: "With attachment Long", price: 160 },
      { name: "With attachment Medium", price: 140 },
      { name: "With attachment Big and short", price: 100 }
    ]
  },
  {
    category: "Special Braiding Services",
    services: [
      { name: "Knotless braids S/S", price: 180 },
      { name: "Knotless braids M/S", price: 160 },
      { name: "Knotless braids B/S", price: 120 },
      { name: "Extra long knotless with other attachment", price: 250 },
      { name: "Stitches braids single", price: 140 },
      { name: "Stitches braids single S/S", price: 100 },
      { name: "Stitches braids single M/S", price: 85 }
    ]
  },
  {
    category: "Special Styles",
    services: [
      { name: "Goddes Braids S/S", price: 200 },
      { name: "Goddes Braids M/S", price: 180 },
      { name: "Bohho Braids long S/S", price: 250 },
      { name: "Bohho Braids short S/S", price: 160 },
      { name: "Butterfly twist S/S", price: 180 },
      { name: "Butterfly twist M/S", price: 160 }
    ]
  },
  {
    category: "Matting Services",
    services: [
      { name: "S/S", price: 60 },
      { name: "M/S", price: 50 },
      { name: "B/S", price: 40 }
    ]
  },
  {
    category: "Beauty Services",
    services: [
      { name: "Facials", price: 100 },
      { name: "Make-up", price: 100 },
      { name: "Make-up and gele", price: 120 },
      { name: "Micro blading and shading", price: 500 },
      { name: "Body piercing with salon ring", price: 105 },
      { name: "Semi permanent eye lashes Classic", price: 150 },
      { name: "Semi permanent eye lashes Volume", price: 250 },
      { name: "Semi permanent eye lashes Mega volume", price: 300 },
      { name: "Eye piercing", price: 105 },
      { name: "Nose piercing", price: 105 }
    ]
  },
  {
    category: "Additional Services",
    services: [
      { name: "Semi dread lock or comb twist", price: 200 },
      { name: "Weave crotchet B/S", price: 75 },
      { name: "Weave crotchet M/S", price: 85 },
      { name: "Weave crotchet S/S", price: 105 },
      { name: "Single crotchet", price: 120 },
      { name: "Washing", price: 30 },
      { name: "Packing of dread", price: 20 },
      { name: "Styling of hair", price: 15 },
      { name: "Half packing gel", price: 25 },
      { name: "Packing gel", price: 55 },
      { name: "Water melon braids", price: 150 }
    ]
  },
  {
    category: "Lock Services",
    services: [
      { name: "Ladies lock twist S/S", price: 350 },
      { name: "Ladies lock twist M/S", price: 300 },
      { name: "Ladies lock twist B/S", price: 250 },
      { name: "Removal of ladies lock extension", price: 90 },
      { name: "Jerry curl making", price: 200 }
    ]
  },
  {
    category: "Wool Services",
    services: [
      { name: "S/S and long", price: 200 },
      { name: "M/S and long", price: 180 },
      { name: "B/S and long", price: 160 },
      { name: "S/S and short", price: 160 },
      { name: "M/S and short", price: 140 },
      { name: "B/S and short", price: 100 }
    ]
  },
  {
    category: "Special Hair Services",
    services: [
      { name: "Weaving with kinky S/S", price: 60 },
      { name: "Weaving with kinky M/S", price: 50 },
      { name: "Weaving with kinky B/S", price: 40 },
      { name: "Butterfly lock", price: 180 },
      { name: "Dye application: Full with client dye", price: 60 },
      { name: "Dye application: Full with salon kits", price: 80 },
      { name: "Highlighting with salon kits", price: 140 },
      { name: "Relocking of dread: full with washing", price: 100 },
      { name: "½ dread lock with washing", price: 100 },
      { name: "Fresh dread making: full with washing", price: 300 },
      { name: "Fresh Dread lock ½ with washing", price: 250 }
    ]
  },
  {
    category: "Barbing Services",
    services: [
      { name: "Adult Hair Cut", price: 20 },
      { name: "Kids Hair Cut", price: 20 },
      { name: "Shaving", price: 10 },
      { name: "Side Pathing", price: 10 },
      { name: "Ladies Hair Cut", price: 25 },
      { name: "White Man Hair Cut", price: 30 },
      { name: "Dreadlock", price: 250 },
      { name: "Relocking of Dread", price: 150 },
      { name: "Cutting of Nails", price: 15 },
      { name: "Manicure Only", price: 20 },
      { name: "Pedicure Only", price: 50 },
      { name: "Facials", price: 70 },
      { name: "Home Service", price: 400 },
      { name: "Barbing & Washing", price: 25 },
      { name: "Barbing & Dyeing", price: 50 },
      { name: "Barbing & Dyeing with Customer Kits", price: 40 },
      { name: "Dyeing Only", price: 30 },
      { name: "Dyeing with Customer Kits", price: 20 },
      { name: "Barbing & Dandruff Treatment", price: 35 },
      { name: "Texturizing", price: 30 },
      { name: "Texturizing with Customer Kits", price: 25 },
      { name: "Barbing & Texturizing", price: 50 },
      { name: "Barbing & Texturizing with Customer Kits", price: 45 },
      { name: "Barbing, Texturizing & Dyeing", price: 80 },
      { name: "Barbing, Texturizing & Dyeing with Customer Kits", price: 70 },
      { name: "Pedicure and Manicure", price: 160 },
      { name: "Color Dye - Short Hair", price: 120 },
      { name: "Color Dye - Long Hair", price: 180 },
      { name: "Barbing & Sportin Wave", price: 100 },
      { name: "Barbing, Sportin Wave with Customer Kits", price: 80 },
      { name: "Barbing, Sportin Wave & Dyeing", price: 140 },
      { name: "Barbing, Sportin Wave & Dyeing with Customer Kits", price: 100 }
    ]
  }
]; 