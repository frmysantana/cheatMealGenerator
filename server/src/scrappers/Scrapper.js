import { JSDOM } from "jsdom";

export default class Scrapper {
    sourceUrl
    excludedCategories
    excludedNames
    tableContents
    sanitizedItems
    items

    constructor(sourceUrl, excludedCategories, excludedNames) {
        this.sourceUrl = sourceUrl
        this.excludedCategories = excludedCategories
        this.excludedNames = excludedNames
    }

    async retrieveDocument() {
        const text = await fetch(this.sourceUrl).then(siteText => siteText.text());
        const { document } = (new JSDOM(text)).window;
        this.tableContents = Array.from(document.querySelectorAll(".tblCompare tbody tr"))
    }

    sanitizeData() {
        let excludedCategories = this.tableContents.reduce((acc, curr, i) => {
            if (curr.className == "subCategory") {
                const name = curr.textContent
                const isExcludedCategory = this.excludedCategories.filter(e => name.toLowerCase().includes(e.toLowerCase()))

                if (isExcludedCategory.length > 0) {
                    acc.push({ index: i, isExcluded: true, name })
                } else {
                    acc.push({ index: i, isExcluded: false, name })
                }
            }

            return acc
        }, []).reverse()

        // sanitize pt 2: remove the excluded categories
        const remainingItems = this.tableContents.filter((item, ind) => {
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

            // sanitize pt 2a: remove specific keywords
            if (this.excludedNames) {
                const name = item.querySelector(".nmItem").textContent.toLowerCase();

                if (this.excludedNames.some((n) => name.includes(n))) {
                    return false
                }
            }

            return true
        })

        this.sanitizedItems = remainingItems
    }

    parseItems() {
        const finalItems = this.sanitizedItems.map((e) => {
            const name = e.querySelector(".nmItem").textContent;
            const calories = e.querySelector("[aria-label*='Calories']").textContent;

            return { name, calories }
        })

        this.items = finalItems
    }

    async scrape() {
        await this.retrieveDocument()
        this.sanitizeData()
        this.parseItems()

        return this.items
    }
}
