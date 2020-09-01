import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Adriano 1',
      email: 'amoreira1@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Adriano 2',
      email: 'amoreira2@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: user.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
