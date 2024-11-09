import Scrapper from "./Scrapper.js";

export default async function burgerKingScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const scrapper = new Scrapper(
    `https://www.nutritionix.com/burger-king/menu/premium`,
    ['drinks & coffee'],
  );
  const results = await scrapper.scrape();

  /**
   * should have 100
   */
  return results;
}
