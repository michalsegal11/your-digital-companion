import { serviceVisitQuery } from "../db/serviceVisit.query";

export const serviceVisitService = {
  getAll: async () => {
    return serviceVisitQuery.findAll();
  },

  getById: async (id: string) => {
    return serviceVisitQuery.findById(id);
  },

  create: async (data: any) => {
    return serviceVisitQuery.create(data);
  },

  update: async (id: string, data: any) => {
    return serviceVisitQuery.update(id, data);
  },

  remove: async (id: string) => {
    return serviceVisitQuery.delete(id);
  }
};
