import Scrapper from "./Scrapper.js";

export default async function popeyesScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const scrapper = new Scrapper(
    `https://www.nutritionix.com/popeyes/menu/premium`,
    ['signature dipping sauces', 'beverages'],
    ['coffee', 'orange juice']
  );
  const results = await scrapper.scrape();

  /**
   * should have 37
   */
  return results;
}
