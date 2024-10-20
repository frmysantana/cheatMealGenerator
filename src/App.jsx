import { useState } from 'react'
import Results from './Results';
import Error from './Error';
import { v4 as uuidv4 } from 'uuid';
import { restaurantOptions } from '../utils/constants';

function App() {
  const [calorieLimit, setCalorieLimit] = useState(100);
  const [restaurant, setRestaurant] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState([])

  const handleCalorieChange = (e) => {
    const number = +e.target.value;
    if (number < 100) {
      setError("Calorie limit must be at least 100.")
    }

    if (number > 2000) {
      setError("Calorie limit cannot exceed 2000.")
    }

    setCalorieLimit(number)
  }

  const handleRestaurantChange = (e) => {
    const restaurant = e.target.value;

    if (Object.values(restaurantOptions).map(opt => opt.value).includes(restaurant)) {
      setRestaurant(restaurant)
    } else {
      setError('Please select a supported restaurant. The options for now are McDonald\'s and Taco Bell.')
    }
  }

  const submitParams = async (e) => {
    e.preventDefault();

    if (!calorieLimit) {
      setError('Please set a calorie limit between 100 and 2000 Calories.')
      return
    } else if (!restaurant) {
      setError('Please select a supported restaurant. The options for now are McDonald\'s and Taco Bell.')
    } else if (calorieLimit >= 100 && calorieLimit <= 2000 && Object.values(restaurantOptions).map(opt => opt.value).includes(restaurant)) {
      // TODO: does this 2nd validation actually help?
      setError('')

      try {
        const fetchConfig = {
          method: "GET",
        }
        const res = await fetch(`http://localhost:3000/meals?restaurant=${restaurant}&limit=${calorieLimit}`, fetchConfig).catch(e => console.error(`fetch error: ${e.message}`))
        const data = await res.json().catch(e => console.error(`res.json error: ${e.message}`))
        const dataWithKeys = data.selectedItems.map(item => {
          return {
            id: uuidv4(),
            name: item.name,
            calories: item.calories
          }
        })

        setResults(dataWithKeys)
      } catch (e) {
        setError(e.message);
      }
    }
  }

  return (
    <>
      <h1>Cheat Meal Generator</h1>
      <div className="card">
        <p>
          Please select a restaurant and enter an upper calorie bound for your cheat meal (the minimum is 100 and maximum is 2000).
        </p>
        <form className="meal-form">
          <div className="input-row">
            <div className="input-container">
              <label htmlFor="restaurant">Restaurant</label>
              <select onChange={handleRestaurantChange} id="restaurant">
                <option value="">Select a restaurant</option>
                {Object.values(restaurantOptions).map(restaurantConfig => <option value={restaurantConfig.value}>{restaurantConfig.label}</option>)}
              </select>
            </div>
            <div  className="input-container"> 
              <label htmlFor="calorie-bound">Calorie Limit</label>
              <input id="calorie-bound" type="number" min={100} max={2000}
                onChange={handleCalorieChange}
                value={calorieLimit}
              />
            </div>
          </div>
          <button onClick={submitParams}>Generate</button>
        </form>
        <Error message={error} />
      </div>
      <Results results={results} />
    </>
  )
}

export default App

/**
 * TODO:
 * X try form actions - only canary version; would have to change versions X
 * X convert cheerio to jsdom X
 * X clean up TacoBell data X
 * X include other restaurants and add restaurant selector component
 * X - add Wendy's
 * - add Burger King
 * - add Popeye's
 * support multiple error messages
 * ally error format
 * show unsupported restaurant server error on frontend
 * resolve punycode deprecation issue (maybe switch node to LTS?)
 * adjust folder structure
 * set veet as middleware between frontend and fastify???
 * convert everything to typescript for teh lulz
 * incorporate SQLite database and change scrappers to run on cronjob
 *  - classes for scrappers?
 *  - Drizzle for ORM?
 * host???
 * try re-implementing FE with svelte and then vue for experimenting
 */

