import { transactionQuery } from "../db/transaction.query";

export const transactionService = {
  getAll: async () => {
    return transactionQuery.findAll();
  },

  getById: async (id: string) => {
    return transactionQuery.findById(id);
  },

  create: async (data: any) => {
    return transactionQuery.create(data);
  },

  update: async (id: string, data: any) => {
    return transactionQuery.update(id, data);
  },

  remove: async (id: string) => {
    return transactionQuery.delete(id);
  }
};
