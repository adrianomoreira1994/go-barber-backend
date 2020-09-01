import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import HashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

export default class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;
    const hashProvider = new HashProvider();

    const userRepository = new UserRepository();

    const authenticateUser = new AuthenticateUserService(
      userRepository,
      hashProvider,
    );

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
