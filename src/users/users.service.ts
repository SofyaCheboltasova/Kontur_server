import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { db } from '../db';

@Injectable()
export class UsersService {
  async createUser(user: Omit<User, '_id'>): Promise<User> {
    return new Promise((res, rej) => {
      db.users.insert(user, (err, newUser) => {
        if (err) rej(err);

        res(newUser);
      });
    });
  }

  async getUserById(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      db.users.findOne({ _id: id }, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  async getUserByLogin(login: string): Promise<User> {
    return new Promise((resolve, reject) => {
      db.users.findOne({ login: login }, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  async getUser(login: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      db.users.findOne({ login, password }, (err, point) => {
        if (err) reject(err);
        resolve(point);
      });
    });
  }

  async updateUser(userId, user: User): Promise<User> {
    return new Promise((res, rej) => {
      db.users.update(
        { _id: userId },
        { $set: user },
        { multi: false, upsert: false },
        (err) => {
          if (err) rej(err);
          res(this.getUserById(userId));
        },
      );
    });
  }
}
