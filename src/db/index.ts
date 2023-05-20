import Nedb, * as Datastore from 'nedb';

import { Bike } from '../bike/bike.interface';
import { Order } from '../order/order.interface';
import { Point } from '../point/point.interface';
import { User } from '../users/user.interface';

interface DataBase {
  orders: Nedb<Order>;
  bikes: Nedb<Bike>;
  points: Nedb<Point>;
  users: Nedb<User>;
}

export const db: DataBase = {
  orders: new Datastore({ filename: 'db/orders' }),
  bikes: new Datastore({ filename: 'db/bikes' }),
  points: new Datastore({ filename: 'db/points' }),
  users: new Datastore({ filename: 'db/users' }),
};

const dbLoadLogger = (message: Error) => {
  if (message) {
    console.error('FATAL: db loading: ', message);
    throw message;
  }
  console.info('SUCCESS db loading');
};

const loadDatabase = () => {
  db.orders.loadDatabase(dbLoadLogger);
  db.bikes.loadDatabase(dbLoadLogger);
  db.points.loadDatabase(dbLoadLogger);
  db.users.loadDatabase(dbLoadLogger);
};

loadDatabase();
