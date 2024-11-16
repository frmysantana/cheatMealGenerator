import { useState } from 'react'
import Results from './Results';
import Error from './Error';
import { v4 as uuidv4 } from 'uuid';
import { restaurantOptions } from '../utils/constants';

function App() {
  const [calorieLimit, setCalorieLimit] = useState(100);
  const [restaurant, setRestaurant] = useState('');
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([])

  const appendNewError = (newError) => {
    const newErrors = errors.filter(e => e.type !== newError.type)
    newErrors.push(newError)

    return newErrors
  }

  const removeError = (type) => {
    return errors.filter(e => e.type !== type)
  }
  const handleCalorieChange = (e) => {
    const number = +e.target.value;
    if (number < 100) {
      setErrors(appendNewError({
        type: "CALORIE_INPUT",
        message: "Calorie limit must be at least 100."
      }))
    }

    if (number > 2000) {
      setErrors(appendNewError({
        type: "CALORIE_INPUT",
        message: "Calorie limit must be less than 2000."
      }))
    } 
    
    if (number >= 100 && number <= 2000) {
      setErrors(removeError('CALORIE_INPUT'))
    }

    setCalorieLimit(number)
  }

  const handleRestaurantChange = (e) => {
    const restaurant = e.target.value;
    const isAvailableOption = Object.values(restaurantOptions).map(opt => opt.value).includes(restaurant)
    
    if (isAvailableOption || restaurant == '') {
      setRestaurant(() => {
        return restaurant
      })
    }

    if (isAvailableOption) {
      setErrors(removeError("RESTAURANT_SELECTION"))
    } else {
      setErrors(appendNewError({
        type: "RESTAURANT_SELECTION",
        message: 'Please select a supported restaurant.'
      }))
    }
  }

  const submitParams = async (e) => {
    e.preventDefault();

    if (!calorieLimit) {
      setErrors(appendNewError({
        type: "CALORIE_INPUT",
        message: 'Please set a calorie limit between 100 and 2000 Calories.'
      }))
    } else if (!restaurant) {
      setErrors(appendNewError({
        type: "RESTAURANT_SELECTION",
        message: 'Please select a supported restaurant.'
      }))
    } else {
      setErrors([])

      try {
        const fetchConfig = {
          method: "GET",
        }
        const res = await fetch(`http://localhost:3000/meals?restaurant=${restaurant}&limit=${calorieLimit}`, fetchConfig).catch(e => console.error(`fetch error: ${e.message}`))
        const data = await res.json()
        
        if (!res.ok) {
          if (data.errorMessage.indexOf('Invalid restaurant (or not supported)') > -1) {
            setErrors(appendNewError({
              type: 'BACKEND_NOT_SUPPORTED',
              message: data.errorMessage
            }))
          } else {
            throw Error(data)
          }
        } else {
          const dataWithKeys = data.selectedItems.map(item => {
            return {
              id: uuidv4(),
              name: item.name,
              calories: item.calories
            }
          })
  
          setErrors(removeError('BACKEND_NOT_SUPPORTED'))
          setResults(dataWithKeys)
        }
      } catch (e) {
        // TODO: write logger
        console.error('try/catch error', {message: e.message})
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
              <select onChange={handleRestaurantChange} id="restaurant" value={restaurant}>
                <option value="">Select one</option>
                {Object.values(restaurantOptions).map(restaurantConfig => <option key={uuidv4()} value={restaurantConfig.value}>{restaurantConfig.label}</option>)}
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
        <Error messages={errors} />
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
 * X - add Burger King
 * X - add Popeye's
 * X - classes for scrappers?
 * X incorporate SQLite database and 
 * X - Drizzle for ORM? overkill - no need
 * X use path to set db location
 * X support multiple error messages
 * X show unsupported restaurant server error on frontend
 * ally error format
 * adjust folder structure
 * set veet as middleware between frontend and fastify???
 * convert everything to typescript for teh lulz
 * change scrappers to run on cronjob
 * add tests
 * host???
 * 
 * 
 * 
 * 
 * try re-implementing FE with svelte and then vue for experimenting
 * resolve punycode deprecation issue (maybe switch node to LTS?)
 * 
 * - authentication
 * - analyze menu from picture
 */
