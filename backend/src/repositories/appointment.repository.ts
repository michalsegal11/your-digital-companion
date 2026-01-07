import { prisma } from '../db/prismaClient';
import { Appointment } from '@prisma/client';

export const AppointmentRepository = {
  create(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.appointment.create({ data });
  },

  findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        serviceVisits: true,
        wigPurchase: true,
      },
    });
  },

  findByClient(clientId: string) {
    return prisma.appointment.findMany({
      where: { clientId },
      orderBy: { startTime: 'asc' },
    });
  },

  findAll() {
    return prisma.appointment.findMany();
  },

  update(id: string, data: Partial<Appointment>) {
    return prisma.appointment.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.appointment.delete({
      where: { id },
    });
  },
};
