import { prisma } from '../prisma/client';
import { Transaction } from '@prisma/client';

export const TransactionRepository = {
  create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.transaction.create({ data });
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

  delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};
