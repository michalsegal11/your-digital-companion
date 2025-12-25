import { prisma } from '../db/prismaClient';
import { WigPurchase } from '@prisma/client';

export const WigPurchaseRepository = {
  create(data: Omit<WigPurchase, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.wigPurchase.create({ data });
  },

  findById(id: string) {
    return prisma.wigPurchase.findUnique({
      where: { id },
      include: {
        client: true,
        appointments: true,
        serviceVisits: true,
        transactions: true,
      },
    });
  },

  findByClient(clientId: string) {
    return prisma.wigPurchase.findMany({
      where: { clientId },
      orderBy: { purchaseDate: 'desc' },
    });
  },

  update(id: string, data: Partial<WigPurchase>) {
    return prisma.wigPurchase.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.wigPurchase.delete({
      where: { id },
    });
  },
};
