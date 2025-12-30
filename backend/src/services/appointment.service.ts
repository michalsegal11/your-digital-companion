import { appointmentQuery } from "../db/appointment.query";
import { clientQuery } from "../db/client.query";

export const appointmentService = {
  getAll: async () => {
    return appointmentQuery.findAll();
  },

  getById: async (id: string) => {
    return appointmentQuery.findById(id);
  },

  create: async (data: any) => {
    return appointmentQuery.create(data);
  },

  update: async (id: string, data: any) => {
    return appointmentQuery.update(id, data);
  },

  remove: async (id: string) => {
    return appointmentQuery.delete(id);
  }
};
