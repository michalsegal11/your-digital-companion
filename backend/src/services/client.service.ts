import { clientQuery } from "../db/client.query";

export const clientService = {
  getAll: async () => {
    return clientQuery.findAll();
  },

  getById: async (id: string) => {
    return clientQuery.findById(id);
  },

  create: async (data: any) => {
    return clientQuery.create(data);
  },

  update: async (id: string, data: any) => {
    return clientQuery.update(id, data);
  },

  remove: async (id: string) => {
    return clientQuery.delete(id);
  }
};
