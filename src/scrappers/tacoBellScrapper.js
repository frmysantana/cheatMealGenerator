// Originally made on ValTown
import cheerio from "cheerio";

export default async function tacoBellNutritionScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const sourceUrl = `https://www.nutritionix.com/taco-bell/menu/premium`;
  const siteText = await fetch(sourceUrl);
  const $ = cheerio.load(await siteText.text());
  const items = $("tr.odd, tr.even").map((i, e) => {
    const name = $(e).find(".nmItem").html();
    const calories = $(e).find("[aria-label*='Calories']").html();

    return { name: name, calories: calories };
  }).toArray();

  const sortedItems = items.sort((a, b) => b.calories - a.calories);

  return Response.json({ sortedItems });
}