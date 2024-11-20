import Scrapper from "./Scrapper.js";

export default async function tacoBellNutritionScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const scrapper = new Scrapper(
    `https://www.nutritionix.com/taco-bell/menu/premium`,
    ['drinks', 'cantina menu', 'cantina beer, wine and spirits', 'las vegas cantina menu', 'fountain beverages (16 oz)', 'fountain beverages (20 oz)', 'fountain beverages (30 oz)'],
    ['oz)', 'coffee', 'creamer', 'juice']
  );
  const results = await scrapper.scrape();

  /**
   * should have 119
   */
  return results;
}


