import { Injectable } from '@nestjs/common';
import { Order } from './order.interface';
import { db } from '../db';

@Injectable()
export class OrderService {
  async create(
    userId: string,
    bikeId: string,
    pointId: string,
  ): Promise<Order> {
    return new Promise((res, rej) => {
      db.orders.insert({ userId, bikeId, pointId }, (err, newOrder) => {
        if (err) rej(err);

        res(newOrder);
      });
    });
  }

  async getOrder(orderId: string): Promise<Order> {
    return new Promise((resolve, reject) => {
      db.orders.findOne({ _id: orderId }, (err, order) => {
        if (err) reject(err);
        resolve(order);
      });
    });
  }

  async deleteOrder(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.orders.remove({ _id: orderId }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async getOrders(userId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      db.orders.find(
        { userId: userId, end: { $exists: false } },
        (err, orders) => {
          if (err) reject(err);
          resolve(orders);
        },
      );
    });
  }

  async getCompletedOrders(userId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      db.orders.find(
        { userId: userId, end: { $exists: true } },
        (err, orders) => {
          if (err) reject(err);
          resolve(orders);
        },
      );
    });
  }

  async rent(userId: string, orderId: string) {
    return new Promise((resolve, reject) => {
      db.orders.update(
        { _id: orderId },
        { $set: { start: new Date() } },
        { multi: false },
        (err) => {
          if (err) reject(err);
          resolve(null);
          db.orders.loadDatabase();
        },
      );
    });
  }

  async stopRent(userId: string, orderId: string) {
    return new Promise((resolve, reject) => {
      db.orders.update(
        { _id: orderId },
        { $set: { end: new Date() } },
        { multi: false },
        (err) => {
          if (err) reject(err);
          resolve(null);
          db.orders.loadDatabase();
        },
      );
    });
  }
}
