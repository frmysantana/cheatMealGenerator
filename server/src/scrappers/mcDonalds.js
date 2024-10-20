import { JSDOM } from "jsdom";

export default async function mcDonaldsNutritionScrapper(upperBound) {
    const sourceUrl = `https://www.nutritionix.com/mcdonalds/menu/premium`;
    const text = await fetch(sourceUrl).then(siteText => siteText.text());
    const { document } = (new JSDOM(text)).window;
    const exclude = ['mccafe coffees', 'beverages'];
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

        return true
    })

    /**
     * should have 72 items
     */
    const items = remainingItems.map((e) => {
        const name = e.querySelector('.nmItem').textContent
        const calories = e.querySelector("[aria-label*='Calories']").textContent.replace(',', '')

        return { name, calories }
    })

    const sortedItems = items.sort((a, b) => Number(b.calories) - Number(a.calories));
    let remaining = upperBound;
    let selectedItems = [];
    sortedItems.forEach(item => {
        if (
            selectedItems.length <= 5 &&
            remaining > 0 &&
            item.calories > 0 &&
            item.calories < remaining
        ) {
            remaining -= item.calories;
            selectedItems.push(item);
        }
    })

    return Response.json({ selectedItems })
}