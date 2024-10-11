import { JSDOM } from "jsdom";

export default async function tacoBellNutritionScrapper(upperBound) { /** : Promise<Response> leaving for when I port to Typescript */
  const sourceUrl = `https://www.nutritionix.com/taco-bell/menu/premium`;
  const text = await fetch(sourceUrl).then(siteText => siteText.text());
  const { document } = (new JSDOM(text)).window;
  // select for NEW, TACOS, BURRITOS, NACHOS, QUESADILLAS, SPECIALTIES, SIDES & SWEETS, CRAVINGS VALUE MENU, VEGGIE CRAVINGS
  // BREAKFAST

  /**
   * All items - 421
   * All items including titles - 438
   * SKIP: drinks inside of NEW (16 oz, 20 oz),
   * Drinks - 14 items,
   * coffee/juice under Breakfast,
   * Cantina menu,
   * CANTINA BEER, WINE AND SPIRITS - all end in " oz)"
   * LAS VEGAS CANTINA MENU - all end in " oz)" or " - LV"
   * FOUNTAIN BEVERAGES (16 OZ) - all end in " oz)"
   * FOUNTAIN BEVERAGES (20 OZ) - all end in " oz)"
   * FOUNTAIN BEVERAGES (30 OZ) - all end in " oz)"
   * should have 115 remaining items
   * */ 

  const exclude = ['drinks', 'cantina menu', 'cantina beer, wine and spirits', 'las vegas cantina menu', 'fountain beverages (16 oz)', 'fountain beverages (20 oz)', 'fountain beverages (30 oz)']
  let all = Array.from(document.querySelectorAll(".tblCompare tbody tr"))
  let excludedCategories = all.reduce((acc, curr, i) => {
    if (curr.className == "subCategory") {
        const name = curr.textContent
        const isExcludedCategory = exclude.filter(e => name.toLowerCase().includes(e.toLowerCase()))

        if (isExcludedCategory.length > 0 ) {
            acc.push({index: i, isExcluded: true, name })
        } else {
            acc.push({index: i, isExcluded: false, name })
        }
    }

    return acc
  }, []).reverse()

  const remainingItems = all.filter((item, ind) => {
    // exclude the rows that are just the category name
    // and the rows within the excluded categories
    if (item.className.includes("subCategory")) {
      return false
    }

    const subCategory = excludedCategories.find((exc) => {
        return ind > exc.index
    })

    return !subCategory.isExcluded
  }).filter((item) => {
    const name = item.querySelector(".nmItem").textContent.toLowerCase();
    const excludedNames = ['oz)', 'coffee', 'creamer', 'juice'];
  
    return !(excludedNames.some((n) => name.includes(n)));
  })
  
  const items = remainingItems.map((e) => {
    const name = e.querySelector(".nmItem").textContent;
    const calories = e.querySelector("[aria-label*='Calories']").textContent;
  
    return { name, calories }
  })

  const sortedItems = items.sort((a, b) => b.calories - a.calories);
  let remaining = upperBound; // should have a lower bound of whatever the minimum-calorie food is after clean-up
  let selectedItems = [];
  let count = 0;
  sortedItems.forEach(item => {
    if (
      selectedItems.length <= 5 && 
      remaining > 0 && 
      item.calories > 0 &&
      item.calories < remaining
    ) {
      console.log(item);
      remaining -= item.calories;
      selectedItems.push(item);
    }
  })

  return Response.json({ selectedItems });
}
