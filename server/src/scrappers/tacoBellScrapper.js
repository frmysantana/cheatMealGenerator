import { JSDOM } from "jsdom";

export default async function tacoBellNutritionScrapper() { /** : Promise<Response> leaving for when I port to Typescript */
  const sourceUrl = `https://www.nutritionix.com/taco-bell/menu/premium`;
  const text = await fetch(sourceUrl).then(siteText => siteText.text());
  const { document } = (new JSDOM(text)).window;

  const exclude = ['drinks', 'cantina menu', 'cantina beer, wine and spirits', 'las vegas cantina menu', 'fountain beverages (16 oz)', 'fountain beverages (20 oz)', 'fountain beverages (30 oz)']
  let all = Array.from(document.querySelectorAll(".tblCompare tbody tr"))
  let excludedCategories = all.reduce((acc, curr, i) => {
    if (curr.className == "subCategory") {
      const name = curr.textContent
      const isExcludedCategory = exclude.filter(e => name.toLowerCase().includes(e.toLowerCase()))

      if (isExcludedCategory.length > 0) {
        acc.push({ index: i, isExcluded: true, name })
      } else {
        acc.push({ index: i, isExcluded: false, name })
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

    if (subCategory.isExcluded) {
      return false
    }

    const name = item.querySelector(".nmItem").textContent.toLowerCase();
    const excludedNames = ['oz)', 'coffee', 'creamer', 'juice'];

    if (excludedNames.some((n) => name.includes(n))) {
      return false
    }

    return true
  })

  /**
   * should have 115
   */
  const items = remainingItems.map((e) => {
    const name = e.querySelector(".nmItem").textContent;
    const calories = e.querySelector("[aria-label*='Calories']").textContent;

    return { name, calories }
  })

  return items
}
