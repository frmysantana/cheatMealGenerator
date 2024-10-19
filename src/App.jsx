import { useState } from 'react'
import Results from './Results';
import Error from './Error';
import { v4 as uuidv4 } from 'uuid';
import { restaurantOptions } from '../utils/constants';

function App() {
  const [ calorieLimit, setCalorieLimit ] = useState(100);
  const [ restaurant, setRestaurant ] = useState('');
  const [ error, setError ] = useState('');
  const [ results, setResults ] = useState([])

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

    if (Object.values(restaurantOptions).includes(restaurant)) {
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
    } else if (calorieLimit >= 100 && calorieLimit <= 2000 && Object.values(restaurantOptions).includes(restaurant)) {
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
        <p>Please enter an upper calorie bound for your cheat meal (the maximum is 2000).</p>
        <form className="meal-form">
            <label for="restaurant">Restaurant</label>
            <select onChange={handleRestaurantChange} id="restaurant">
              <option value={restaurantOptions.TACOBELL}>Taco Bell</option>
              <option value={restaurantOptions.MCDONALDS}>McDonald's</option>
            </select>
          <label for="calorie-bound">Calorie Limit</label>
          <div className="input-container">
            <input id="calorie-bound" type="number" min={100} max={2000} 
              onChange={handleCalorieChange}
              /** figure out how to submit with enter key */
              // onKeyUp={(e) => {
              //   e.preventDefault();
              //   if (e.code === "13" || e.key === "Enter") {
              //     console.log('you hit the enter key!')
              //   }
              // }}
              // onEnter={() => buttonRef.current.click()}
              value={calorieLimit}
            />
            <button onClick={submitParams}>Generate</button>
          </div>
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
 * include other restaurants and add restaurant selector component
 * resolve punycode deprecation issue (maybe switch node to LTS?)
 * set veet as middleware between frontend and fastify???
 * convert everything to typescript for teh lulz
 * host???
 * try re-implementing FE with svelte and then vue for experimenting
 */

