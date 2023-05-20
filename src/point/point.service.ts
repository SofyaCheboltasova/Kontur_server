import { Injectable } from '@nestjs/common';
import { Point } from './point.interface';
import { db } from '../db';

@Injectable()
export class PointService {
  async getPoint(id): Promise<Point> {
    return new Promise((resolve, reject) => {
      db.points.findOne<Point>({ _id: id }, (err, point) => {
        if (err) reject(err);
        resolve(point);
      });
    });
  }

  async getList(): Promise<Point[]> {
    return new Promise((res, rej) => {
      db.points.find<Point>({}, (err, list) => {
        if (err) rej(err);
        res(list);
      });
    });
  }

  async getBikePoint(bikeId: string): Promise<Point> {
    return new Promise((res, rej) => {
      db.points.find<Point>({ bikesList: { $in: [bikeId] } }, (err, list) => {
        err && rej(err);
        res(list[0]);
      });
    });
  }
}
