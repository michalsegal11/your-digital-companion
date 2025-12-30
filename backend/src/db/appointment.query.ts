import { prisma } from "./prismaClient";

export const appointmentQuery = {
  findAll: () => prisma.appointment.findMany(),

  findById: (id: string) =>
    prisma.appointment.findUnique({ where: { id } }),

  create: (data: any) =>
    prisma.appointment.create({ data }),

  update: (id: string, data: any) =>
    prisma.appointment.update({
      where: { id },
      data
    }),

  delete: (id: string) =>
    prisma.appointment.delete({
      where: { id }
    })
};
