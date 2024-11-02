import { DatabaseSync } from 'node:sqlite';
import mcDonalds from './mcDonalds.js';
import tacoBell from './tacoBellScrapper.js';
import wendys from './wendys.js';
import { restaurantOptions } from '../../../utils/constants.js';
import { dbPath } from './constants.js';

const database = new DatabaseSync(`${dbPath}`);

database.exec(`
  CREATE TABLE foods(
    id INTEGER PRIMARY KEY ASC,
    restaurant TEXT,
    name TEXT,
    calories INTEGER
  ) STRICT
`);

const insert = database.prepare('INSERT INTO foods (restaurant, name, calories) VALUES (?, ?, ?)');

const mDItems = await mcDonalds()
mDItems.forEach(item => {
  insert.run(restaurantOptions.MCDONALDS.value, item.name, +item.calories);
})

const tbItems = await tacoBell()
tbItems.forEach(item => {
  insert.run(restaurantOptions.TACOBELL.value, item.name, +item.calories);
})

const wItems = await wendys()
wItems.forEach(item => {
  insert.run(restaurantOptions.WENDYS.value, item.name, +item.calories);
})

database.close();
