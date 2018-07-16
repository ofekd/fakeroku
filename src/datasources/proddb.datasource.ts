import {inject} from '@loopback/core';
import {juggler, DataSource, AnyObject} from '@loopback/repository';
const config = require('./proddb.datasource.json');

export class ProddbDataSource extends juggler.DataSource {
  static dataSourceName = 'proddb';

  constructor(
    @inject('datasources.config.proddb', {optional: true})
    dsConfig: AnyObject = config
  ) {
    super(dsConfig);
  }
}
