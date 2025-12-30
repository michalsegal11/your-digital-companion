import { prisma } from "./prismaClient";
export const transactionQuery = {
  findAll: () => prisma.transaction.findMany(),

  findById: (id: string) =>
    prisma.transaction.findUnique({ where: { id } }),

  create: (data: any) =>
    prisma.transaction.create({ data }),

  update: (id: string, data: any) =>
    prisma.transaction.update({
      where: { id },
      data
    }),

  delete: (id: string) =>
    prisma.transaction.delete({
      where: { id }
    })
};
