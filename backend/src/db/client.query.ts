import { prisma } from "./prismaClient";

export const clientQuery = {
  findAll: () => prisma.client.findMany(),
  findById: (id: string) =>
    prisma.client.findUnique({ where: { id } }),

  create: (data: any) =>
    prisma.client.create({ data }),

  update: (id: string, data: any) =>
    prisma.client.update({
      where: { id },
      data
    }),

  delete: (id: string) =>
    prisma.client.delete({ where: { id } })
};
