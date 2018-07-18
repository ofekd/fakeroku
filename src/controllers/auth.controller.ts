import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories';
import { Utils } from '../services';
import {
  post, requestBody,
} from '@loopback/rest';
import { sign, Secret } from 'jsonwebtoken';
import { HttpErrors } from '@loopback/rest';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('options.tokenSecret')
    private tokenSecret: string,
  ) { }

  @post('/auth/login')
  async login(@requestBody() creds: {
    email: string;
    password: string;
  }): Promise<Secret> {
    const user = await this.userRepository.findOne({
      where: {
        email: creds.email
      }
    });

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    } else if (await Utils.verifyHash(user.password, creds.password)) {
      return sign(user.toJSON(), this.tokenSecret);
    } else {
      throw new HttpErrors.Unauthorized('Wrong password');
    }
  }
}