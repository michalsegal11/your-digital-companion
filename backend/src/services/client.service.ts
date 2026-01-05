import { ClientRepository } from "../repositories/client.repository";

export const clientService = {
  getAll: async () => {
    return ClientRepository.findAll();
  },

  getById: async (id: string) => {
    return ClientRepository.findById(id);
  },

  create: async (data: any) => {
    return ClientRepository.create(data);
  },

  update: async (id: string, data: any) => {
    return ClientRepository.update(id, data);
  },

  remove: async (id: string) => {
    return ClientRepository.delete(id);
  }
};
