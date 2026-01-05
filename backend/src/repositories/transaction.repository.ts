import { prisma } from '../db/prismaClient';
import { Transaction } from '@prisma/client';

export const TransactionRepository = {
  create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.transaction.create({ data });
  },

  findAll() {
    return prisma.transaction.findMany();
  },

  findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        client: true,
        serviceVisit: true,
        wigPurchase: true,
      },
    });
  },

  findByDateRange(from: Date, to: Date) {
    return prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { transactionDate: 'desc' },
    });
  },

  update(id: string, data: Partial<Transaction>) {
      return prisma.transaction.update({
        where: { id },
        data,
      });
    },

  delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};
