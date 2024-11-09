import Scrapper from "./Scrapper.js";

export default async function wendysNutritionScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const scrapper = new Scrapper(
    `https://www.nutritionix.com/wendys/menu/premium`,
    ["coffee", "beverages"],
    ['oz)', 'coffee', 'creamer', 'juice']
  );
  const results = await scrapper.scrape();

  /**
   * should have 111 items
   */
  return results;
}