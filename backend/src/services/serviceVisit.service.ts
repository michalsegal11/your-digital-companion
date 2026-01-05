import { ServiceVisitRepository } from "../repositories/serviceVisit.repository";

export const serviceVisitService = {
  getAll: async () => {
    return ServiceVisitRepository.findAll();
  },

  getById: async (id: string) => {
    return ServiceVisitRepository.findById(id);
  },

  create: async (data: any) => {
    return ServiceVisitRepository.create(data);
  },

  update: async (id: string, data: any) => {
    return ServiceVisitRepository.update(id, data);
  },

  remove: async (id: string) => {
    return ServiceVisitRepository.delete(id);
  }
};
