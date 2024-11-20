import { DatabaseSync } from 'node:sqlite';
import { dbPath } from './scrappers/constants.js';

export default function meals(restaurant, upperBound) {
    const database = new DatabaseSync(`${dbPath}`);
    const query = database.prepare(`SELECT * FROM foods WHERE restaurant = ? ORDER BY calories DESC`);
    const items = query.all(restaurant)

    let remaining = upperBound;
    let selectedItems = [];
    items.forEach(item => {
        if (
        selectedItems.length <= 5 &&
        remaining > 0 &&
        item.calories > 0 &&
        item.calories < remaining
        ) {
        remaining -= item.calories;
        selectedItems.push({
            name: item.name,
            calories: item.calories
        });
        }
    })

    database.close()

    return Response.json({ selectedItems });
};
