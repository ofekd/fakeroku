import { Entity, model, property } from '@loopback/repository';

@model()
export class Resource extends Entity {
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
  name: string;

  @property({
    type: 'number'
  })
  ownerId: string;

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}
