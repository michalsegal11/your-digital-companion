import { WigPurchaseRepository } from "../repositories/wigPurchase.repository";

export const wigPurchaseService = {
  getAll: async () => {
    return WigPurchaseRepository.findAll();
  },

  getById: async (id: string) => {
    return WigPurchaseRepository.findById(id);
  },

  create: async (data: any) => {
    return WigPurchaseRepository.create(data);
  },

  update: async (id: string, data: any) => {
    return WigPurchaseRepository.update(id, data);
  },

  remove: async (id: string) => {
    return WigPurchaseRepository.delete(id);
  }
};
