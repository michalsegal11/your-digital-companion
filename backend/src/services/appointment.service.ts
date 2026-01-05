import { AppointmentRepository } from "../repositories/appointment.repository";

export const appointmentService = {
  getAll: async () => {
    return AppointmentRepository.findAll();
  },

  getById: async (id: string) => {
    return AppointmentRepository.findById(id);
  },

  create: async (data: any) => {
    return AppointmentRepository.create(data);
  },

  update: async (id: string, data: any) => {
    return AppointmentRepository.update(id, data);
  },

  remove: async (id: string) => {
    return AppointmentRepository.delete(id);
  }
};
