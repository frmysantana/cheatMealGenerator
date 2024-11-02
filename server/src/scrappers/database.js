import { DatabaseSync } from 'node:sqlite';
import mcDonalds from './mcDonalds.js';
import tacoBell from './tacoBellScrapper.js';
import wendys from './wendys.js';
import { restaurantOptions } from '../../../utils/constants.js';
import { dbPath } from './constants.js';

const errors = {
  ALREADY_EXISTS: 'table foods already exists',
}

const database = new DatabaseSync(`${dbPath}`);

const insertFoods = async (insertStm) => {
  const [mDItems, tbItems, wItems] = await Promise.all([
    mcDonalds(), 
    tacoBell(),
    wendys()
  ])

  mDItems.forEach(item => {
    insertStm.run(restaurantOptions.MCDONALDS.value, item.name, +item.calories);
  })
  tbItems.forEach(item => {
    insertStm.run(restaurantOptions.TACOBELL.value, item.name, +item.calories);
  })
  wItems.forEach(item => {
    insertStm.run(restaurantOptions.WENDYS.value, item.name, +item.calories);
  })
}

try {
  database.exec(`
    CREATE TABLE foods(
      restaurant TEXT,
      name TEXT,
      calories INTEGER,
      PRIMARY KEY (restaurant, name)
    ) STRICT
  `);

  const insert = database.prepare('INSERT INTO foods (restaurant, name, calories) VALUES (?, ?, ?)');
  await insertFoods(insert)
} catch (e) {
  if (e.message != errors.ALREADY_EXISTS) {
    throw e
  }

  // foods already exists and only has to be updated with potentially new values
  const insert = database.prepare('INSERT OR REPLACE INTO foods (restaurant, name, calories) VALUES (?, ?, ?);');
  await insertFoods(insert)
}

database.close();
