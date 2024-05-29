import cheerio from "cheerio";

export default async function tacoBellNutritionScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const sourceUrl = `https://www.nutritionix.com/taco-bell/menu/premium`;
  const siteText = await fetch(sourceUrl);
  const $ = cheerio.load(await siteText.text());
  // select for NEW, TACOS, BURRITOS, NACHOS, QUESADILLAS, SPECIALTIES, SIDES & SWEETS, CRAVINGS VALUE MENU, VEGGIE CRAVINGS
  // BREAKFAST

  /**
   * All items - 419
   * All items including titles - 436
   * SKIP: drinks inside of NEW (16 oz, 20 oz),
   * Drinks - 14 items,
   * coffee/juice under Breakfast,
   * Cantina menu,
   * CANTINA BEER, WINE AND SPIRITS - all end in " oz)"
   * LAS VEGAS CANTINA MENU - all end in " oz)" or " - LV"
   * FOUNTAIN BEVERAGES (16 OZ) - all end in " oz)"
   * FOUNTAIN BEVERAGES (20 OZ) - all end in " oz)"
   * FOUNTAIN BEVERAGES (30 OZ) - all end in " oz)"
   * */ 

  // experimental code to sanitize data; plan is to find the indeces of excluded categories and filter elements in reverse based on if their index is in an excluded category
  /**
   * const exclude = ['drinks', 'cantina menu', 'cantina beer, wine and spirits', 'las vegas cantina menu', 'fountain beverages (16 oz)', 'fountain beverages (20 oz)', 'fountain beverages (30 oz)']
  let all = Array.from(document.querySelectorAll(".tblCompare tbody tr"))
  let excludedIndeces = all.reduce((acc, curr, i) => {
    if (curr.className == "subCategory") {
        const name = curr.innerText
        const isExcludedCategory = exclude.filter(e => name.toLowerCase().includes(e.toLowerCase()))

        if (isExcludedCategory.length > 0 ) {
            acc.push({index: i, isExcluded: true, name })
        } else {
            acc.push({index: i, isExcluded: false, name })
        }
    }

    return acc
  }, [])
   */
  const exclude = ['drinks', 'cantina menu', 'cantina beer, wine and spirits', 'las vegas cantina menu', 'fountain beverages (16 oz)', 'fountain beverages (20 oz)', 'fountain beverages (30 oz)']
  let all = Array.from(document.querySelectorAll(".tblCompare tbody tr"))
  let excludedIndeces = all.reduce((acc, curr, i) => {
    if (curr.className === "subCategory") {
        const isExcludedCategory = exclude.filter(e => curr.innerText.toLowerCase().includes(e.toLowerCase()))

        if (isExcludedCategory.length > 0 ) return i
    }
  }, [])
  
  const items = $("tr.odd, tr.even").map((i, e) => {
    const name = $(e).find(".nmItem").html();
    const calories = $(e).find("[aria-label*='Calories']").html();

    return { name: name, calories: calories };
  }).toArray();

  const sortedItems = items.sort((a, b) => b.calories - a.calories);

  return Response.json({ sortedItems });
}