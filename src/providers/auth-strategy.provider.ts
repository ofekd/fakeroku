import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';
import { UserRepository } from '../repositories';
import { repository } from '@loopback/repository';

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @inject('options.tokenSecret')
    private tokenSecret: string,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'JwtStrategy') {
      return new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.tokenSecret
      }, this.verify.bind(this));
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  async verify(
    jwtPayload: User,
    cb: (err: Error | null, user?: User | false) => void,
  ) {

    try {
      const user = await this.userRepository.findById(jwtPayload.id);
      if (user) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    } catch (err) {
      return cb(err);
    }
  }
}
