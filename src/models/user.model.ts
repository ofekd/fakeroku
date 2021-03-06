import { Resource } from './resource.model'
import { Entity, model, property, hasMany } from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @property({
    type: 'boolean',
    default: false
  })
  isAdmin: boolean;

  @property({
    type: 'number',
    default: -1
  })
  quota: number;

  @hasMany(Resource, {
    keyTo: 'ownerId'
  })
  resources?: Resource[];

  constructor(data?: Partial<User>) {
    super(data);
  }

  toJSON(): Object {
    const userObj = <User>super.toJSON();
    delete userObj.password;

    return userObj;
  }
}
