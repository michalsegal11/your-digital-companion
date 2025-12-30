import { prisma } from "./prismaClient";

export const serviceVisitQuery = {
  findAll: () => prisma.serviceVisit.findMany(),

  findById: (id: string) =>
    prisma.serviceVisit.findUnique({ where: { id } }),

  create: (data: any) =>
    prisma.serviceVisit.create({ data }),

  update: (id: string, data: any) =>
    prisma.serviceVisit.update({
      where: { id },
      data
    }),

  delete: (id: string) =>
    prisma.serviceVisit.delete({
      where: { id }
    })
};
