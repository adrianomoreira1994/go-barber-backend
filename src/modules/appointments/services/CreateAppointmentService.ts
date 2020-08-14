import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentinSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentinSameDate)
      throw new AppError('This appointment is already booked');

    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
