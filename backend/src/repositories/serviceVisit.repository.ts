import { prisma } from '../db/prismaClient';
import { ServiceVisit } from '@prisma/client';

export const ServiceVisitRepository = {
  create(data: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.serviceVisit.create({ data });
  },

  findById(id: string) {
    return prisma.serviceVisit.findUnique({
      where: { id },
      include: {
        appointment: true,
        wigPurchase: true,
        transactions: true,
      },
    });
  },

  findByAppointment(appointmentId: string) {
    return prisma.serviceVisit.findMany({
      where: { appointmentId },
    });
  },

  update(id: string, data: Partial<ServiceVisit>) {
    return prisma.serviceVisit.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.serviceVisit.delete({
      where: { id },
    });
  },
};
