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
        id: "calorie-bound-error",
        message: "Calorie limit must be at least 100."
      }))
    }

    if (number > 2000) {
      setErrors(appendNewError({
        type: "CALORIE_INPUT",
        id: "calorie-bound-error",
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
        id: "restaurant-error",
        message: 'Please select a supported restaurant.'
      }))
    }
  }

  const submitParams = async (e) => {
    e.preventDefault();

    if (!calorieLimit) {
      setErrors(appendNewError({
        type: "CALORIE_INPUT",
        id: "calorie-bound-error",
        message: 'Please set a calorie limit between 100 and 2000 Calories.'
      }))
    } else if (!restaurant) {
      setErrors(appendNewError({
        type: "RESTAURANT_SELECTION",
        id: "restaurant-error",
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
        console.error('try/catch error', { message: e.message })
      }
    }
  }

  const restaurantErrorProps = errors.filter(e => e.type == 'RESTAURANT_SELECTION').length == 1 ? {
    ariaDescribedby: "restaurant-error",
    ariaInvalid: "true"
  } : {
    ariaDescribedby: null,
    ariaInvalid: null
  }

  const calorieBoundErrorProps = errors.filter(e => e.type == 'CALORIE_INPUT').length == 1 ? {
    ariaDescribedby: "calorie-bound-error",
    ariaInvalid: "true"
  } : {
    ariaDescribedby: null,
    ariaInvalid: null
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
              <select onChange={handleRestaurantChange} id="restaurant" value={restaurant} aria-describedby={restaurantErrorProps.ariaDescribedby}
                aria-invalid={restaurantErrorProps.ariaInvalid}>
                <option value="">Select one</option>
                {Object.values(restaurantOptions).map(restaurantConfig => <option key={uuidv4()} value={restaurantConfig.value}>{restaurantConfig.label}</option>)}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="calorie-bound">Calorie Limit</label>
              <input id="calorie-bound" type="number" min={100} max={2000} aria-describedby={calorieBoundErrorProps.ariaDescribedby}
                aria-invalid={calorieBoundErrorProps.ariaInvalid}
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
