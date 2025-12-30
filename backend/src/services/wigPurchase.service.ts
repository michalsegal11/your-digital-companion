import { wigPurchaseQuery } from "../db/wigPurchase.query";

export const wigPurchaseService = {
  getAll: async () => {
    return wigPurchaseQuery.findAll();
  },

  getById: async (id: string) => {
    return wigPurchaseQuery.findById(id);
  },

  create: async (data: any) => {
    return wigPurchaseQuery.create(data);
  },

  update: async (id: string, data: any) => {
    return wigPurchaseQuery.update(id, data);
  },

  remove: async (id: string) => {
    return wigPurchaseQuery.delete(id);
  }
};
