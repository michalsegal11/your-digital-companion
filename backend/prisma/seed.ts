import { PrismaClient, PreferredContactMethod, AppointmentStatus, AppointmentSource, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---- Clients ----
  const clients = [];
  for (let i = 1; i <= 10; i++) {
    clients.push(await prisma.client.create({
      data: {
        fullName: `לקוחה ${i}`,
        phone: `05000000${String(i).padStart(2, '0')}`,
        email: `client${i}@example.com`,
        notes: `הערות לדוגמה עבור לקוחה ${i}`,
        preferredContactMethod: (i % 2 === 0 ? 'EMAIL' : 'PHONE') as PreferredContactMethod
      }
    }));
  }

  // ---- Wig Purchases ----
  const wigPurchases = [];
  for (let i = 0; i < clients.length; i++) {
    for (let j = 1; j <= 2; j++) {
      wigPurchases.push(await prisma.wigPurchase.create({
        data: {
          clientId: clients[i].id,
          purchaseDate: new Date(2025, j - 1, 1),
          wigDescription: `פאה דגם ${j} עבור ${clients[i].fullName}`,
          price: 1000 + j * 200,
          warrantyEndDate: new Date(2026, j - 1, 1),
          freeStylingEndDate: new Date(2025, j, 1),
          maxFreeStylingVisits: 3,
          notes: `רכישה מספר ${j} של ${clients[i].fullName}`
        }
      }));
    }
  }

  // ---- Appointments ----
  const appointments = [];
  for (let i = 0; i < clients.length; i++) {
    for (let j = 1; j <= 2; j++) {
      const wigPurchaseIndex = i * 2 + j - 1;
      appointments.push(await prisma.appointment.create({
        data: {
          clientId: clients[i].id,
          startTime: new Date(2025, j - 1, j, 10, 0),
          endTime: new Date(2025, j - 1, j, 11, 0),
          status: 'SCHEDULED' as AppointmentStatus,
          source: (j % 2 === 0 ? 'APP' : 'PHONE') as AppointmentSource,
          serviceName: `שירות ${j}`,
          wigPurchaseId: wigPurchaseIndex < wigPurchases.length ? wigPurchases[wigPurchaseIndex].id : null,
          notes: `תור מספר ${j} עבור ${clients[i].fullName}`
        }
      }));
    }
  }

  // ---- Service Visits ----
  const serviceVisits = [];
  for (let i = 0; i < appointments.length; i++) {
    const month = i % 11;
    serviceVisits.push(await prisma.serviceVisit.create({
      data: {
        appointmentId: appointments[i].id,
        wigPurchaseId: i < wigPurchases.length ? wigPurchases[i].id : null,
        visitDate: new Date(2025, month, (i % 28) + 1, 10, 0),
        serviceName: `ביקור שירות ${i + 1}`,
        isFree: i % 2 === 0,
        freeReason: i % 2 === 0 ? 'אחריות' : null,
        priceCharged: 500 + i * 10,
        internalCost: 200,
        notes: `ביקור שירות עבור תור ${appointments[i].id}`
      }
    }));
  }

  // ---- Transactions ----
  for (let i = 0; i < serviceVisits.length; i++) {
    await prisma.transaction.create({
      data: {
        type: (i % 2 === 0 ? 'INCOME' : 'EXPENSE') as TransactionType,
        amount: 500 + i * 10,
        transactionDate: new Date(),
        clientId: appointments[i % appointments.length].clientId,
        serviceVisitId: serviceVisits[i].id,
        wigPurchaseId: i < wigPurchases.length ? wigPurchases[i].id : null,
        category: i % 2 === 0 ? 'תשלום' : 'הוצאה',
        description: `טרנזקציה עבור ביקור שירות ${serviceVisits[i].id}`
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });