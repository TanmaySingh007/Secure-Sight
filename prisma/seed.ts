import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create cameras
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Shop Floor Camera A',
        location: 'Manufacturing Floor - Section A',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Vault Security Camera',
        location: 'High Security Vault - Level B2',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Main Entrance Camera',
        location: 'Building Main Entrance - Ground Floor',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Parking Lot Camera B',
        location: 'Employee Parking - North Side',
      },
    }),
  ]);

  // Create incidents distributed across 24 hours
  const incidentTypes = ['Unauthorized Access', 'Gun Threat', 'Face Recognized', 'Suspicious Activity', 'Equipment Malfunction'];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0); // Start of today

  const incidents = [];
  
  for (let i = 0; i < 15; i++) {
    const startHour = Math.floor(Math.random() * 24);
    const startMinute = Math.floor(Math.random() * 60);
    const duration = Math.floor(Math.random() * 10) + 2; // 2-12 minutes
    
    const tsStart = new Date(baseDate);
    tsStart.setHours(startHour, startMinute, 0, 0);
    
    const tsEnd = new Date(tsStart);
    tsEnd.setMinutes(tsEnd.getMinutes() + duration);
    
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    
    incidents.push({
      cameraId: randomCamera.id,
      type: randomType,
      tsStart,
      tsEnd,
      thumbnailUrl: `/images/incident-${(i % 5) + 1}.jpg`,
      resolved: Math.random() > 0.7, // 30% chance of being resolved
    });
  }

  // Create incidents
  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident,
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created ${cameras.length} cameras and ${incidents.length} incidents`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });