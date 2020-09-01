import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Adriano');
    expect(profile.email).toBe('amoreira@gmail.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    await expect(
      showProfileService.execute({
        user_id: 'non-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
