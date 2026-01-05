import { TransactionRepository } from "../repositories/transaction.repository";

export const transactionService = {
  getAll: async () => {
    return TransactionRepository.findAll();
  },

  getById: async (id: string) => {
    return TransactionRepository.findById(id);
  },

  create: async (data: any) => {
    return TransactionRepository.create(data);
  },

  update: async (id: string, data: any) => {
    return TransactionRepository.update(id, data);
  },

  remove: async (id: string) => {
    return TransactionRepository.delete(id);
  }
};
