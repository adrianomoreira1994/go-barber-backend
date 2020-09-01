import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Adriano 2',
      email: 'adrianomoreira@gmail.com',
    });

    expect(updatedUser.name).toBe('Adriano 2');
    expect(updatedUser.email).toBe('adrianomoreira@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Adriano Teste',
      email: 'teste@gmail.com',
      password: '11111111',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Adriano 2',
        email: 'amoreira@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the profile from non-existing user', async () => {
    await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: 'non-exists',
        name: 'Adriano 2',
        email: 'amoreira@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Adriano 2',
      email: 'adrianomoreira@gmail.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Adriano 2',
        email: 'adrianomoreira@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Adriano',
      email: 'amoreira@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Adriano 2',
        email: 'adrianomoreira@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
