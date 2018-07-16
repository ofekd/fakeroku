import { Resource } from './resource.model'
import { Entity, model, property, hasMany } from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true
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
  passwordHash: string;

  @property({
    type: 'boolean',
    required: true,
    default: false
  })
  isAdmin: boolean;

  @property({
    type: 'number',
    required: true,
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
}
