import { Injectable } from '@nestjs/common';

import { Bike } from './bike.interface';
import { db } from '../db';

@Injectable()
export class BikeService {
  getBikeById = (id: string): Promise<Bike> => {
    return new Promise((resolve, reject) => {
      db.bikes.findOne<Bike>({ _id: id }, (err, bike) => {
        if (err) reject(err);
        resolve(bike);
      });
    });
  };

  async getList(): Promise<Bike[]> {
    return new Promise((resolve, reject) => {
      db.bikes.find<Bike>({}, (err, bikes) => {
        if (err) reject(err);
        resolve(bikes);
      });
    });
  }

  async getListByIds(idList: string[]): Promise<Bike[]> {
    const bikesPromises = idList.map(this.getBikeById);
    return await Promise.all(bikesPromises);
  }
}
