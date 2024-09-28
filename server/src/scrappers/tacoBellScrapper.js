import { JSDOM } from "jsdom";

export default async function tacoBellNutritionScrapper(upperBound) { /** : Promise<Response> leaving for when I port to Typescript */
  const sourceUrl = `https://www.nutritionix.com/taco-bell/menu/premium`;
  const text = await fetch(sourceUrl).then(siteText => siteText.text());
  const { document } = (new JSDOM(text)).window;

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
    if (item.className.includes("subCategory")) {
      return false
    }

    const subCategory = excludedCategories.find((exc) => {
        return ind > exc.index
    })
    
    if (subCategory.isExcluded) {
      return false
    }
    
    const name = item.textContent.toLowerCase();
    if (
      name.indexOf("oz)") > -1 ||
      name.indexOf("coffee") > -1 ||
      name.indexOf("creamer") > -1
    ) {
      return false
    }

    return true
  })
  
  const items = remainingItems.map((e) => {
    const name = e.querySelector(".nmItem").textContent;
    const calories = e.querySelector("[aria-label*='Calories']").textContent;

    return { name, calories }
  })

  const sortedItems = items.sort((a, b) => b.calories - a.calories);
  let remaining = upperBound;
  let selectedItems = [];
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
