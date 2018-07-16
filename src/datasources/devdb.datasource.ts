import {inject} from '@loopback/core';
import {juggler, DataSource, AnyObject} from '@loopback/repository';
const config = require('./devdb.datasource.json');

export class DevdbDataSource extends juggler.DataSource {
  static dataSourceName = 'devdb';

  constructor(
    @inject('datasources.config.devdb', {optional: true})
    dsConfig: AnyObject = config
  ) {
    super(dsConfig);
  }
}
