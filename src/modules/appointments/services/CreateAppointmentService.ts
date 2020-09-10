import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Yout cant't create an appointment on a past date");
    }

    if (user_id === provider_id) {
      throw new AppError("Yout cant't create an appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("Yout cant't create appointment between 8am and 5pm");
    }

    const findAppointmentinSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentinSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
