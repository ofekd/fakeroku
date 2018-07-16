import {Filter, Where, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  patch,
  del,
  requestBody
} from '@loopback/rest';
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository : ResourceRepository,
  ) {}

  @post('/resources')
  async create(@requestBody() obj: Resource)
    : Promise<Resource> {
    return await this.resourceRepository.create(obj);
  }

  @get('/resources/count')
  async count(@param.query.string('where') where?: Where): Promise<number> {
    return await this.resourceRepository.count(where);
  }

  @get('/resources')
  async find(@param.query.string('filter') filter?: Filter)
    : Promise<Resource[]> {
    return await this.resourceRepository.find(filter);
  }

  @patch('/resources')
  async updateAll(
    @requestBody() obj: Resource,
    @param.query.string('where') where?: Where,
  ): Promise<number> {
    return await this.resourceRepository.updateAll(obj, where);
  }

  @del('/resources')
  async deleteAll(@param.query.string('where') where?: Where): Promise<number> {
    return await this.resourceRepository.deleteAll(where);
  }

  @get('/resources/{id}')
  async findById(@param.path.number('id') id: number): Promise<Resource> {
    return await this.resourceRepository.findById(id);
  }

  @patch('/resources/{id}')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() obj: Resource
  ): Promise<boolean> {
    return await this.resourceRepository.updateById(id, obj);
  }

  @del('/resources/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<boolean> {
    return await this.resourceRepository.deleteById(id);
  }
}
