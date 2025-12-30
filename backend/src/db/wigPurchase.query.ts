import { prisma } from "./prismaClient";

export const wigPurchaseQuery = {
  findAll: () => prisma.wigPurchase.findMany(),

  findById: (id: string) =>
    prisma.wigPurchase.findUnique({ where: { id } }),

  create: (data: any) =>
    prisma.wigPurchase.create({ data }),

  update: (id: string, data: any) =>
    prisma.wigPurchase.update({
      where: { id },
      data
    }),

  delete: (id: string) =>
    prisma.wigPurchase.delete({
      where: { id }
    })
};
