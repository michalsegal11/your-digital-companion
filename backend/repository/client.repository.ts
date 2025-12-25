import { prisma } from '../prisma/client';
import { Client } from '@prisma/client';

export const ClientRepository = {
  create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.client.create({ data });
  },

  findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        appointments: true,
        wigPurchases: true,
        transactions: true,
      },
    });
  },

  findAll() {
    return prisma.client.findMany();
  },

  update(id: string, data: Partial<Client>) {
    return prisma.client.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.client.delete({
      where: { id },
    });
  },
};
