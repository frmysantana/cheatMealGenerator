import Scrapper from "./Scrapper.js";

export default async function mcDonaldsNutritionScrapper() {
    const scrapper = new Scrapper(
        `https://www.nutritionix.com/mcdonalds/menu/premium`,
        ['mccafe coffees', 'beverages']
      );
    const results = await scrapper.scrape();

    // /**
    //  * should have 72 items
    //  */
    return results
}
