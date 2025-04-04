import { getStaff } from '../src/lib/firebase/services.js';

async function main() {
  try {
    console.log('Fetching staff data...');
    const staff = await getStaff();
    console.log('Staff members:', staff.length);
    staff.forEach(member => {
      console.log(`- ${member.name} (${member.role})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error fetching staff data:', error);
    process.exit(1);
  }
}

main(); 