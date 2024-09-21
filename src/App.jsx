import { useState } from 'react'
import Results from './Results';
import Error from './Error';
import { v4 as uuidv4 } from 'uuid';
// import { useRef } from 'react';

function App() {
  // const buttonRef = useRef(null);
  const [ calorieLimit, setCalorieLimit ] = useState(100);
  const [ error, setError ] = useState('');
  const [ results, setResults ] = useState([])

  const handleOnChange = (e) => {
    const number = +e.target.value;
    if (number < 100) {
      setError("Calorie limit must be at least 100.")
    }

    if (number > 2000) {
      setError("Calorie limit cannot exceed 2000.")
    }

    setCalorieLimit(number)
  }

  const submitLimit = async (e) => {
    e.preventDefault();
  
    if (!calorieLimit) {
      setError('Please set a calorie limit between 100 and 2000 Calories.')
      return
    } else if (calorieLimit >= 100 && calorieLimit <= 2000) {
      setError('')

      try {
        const fetchConfig = {
          method: "GET",
        }
        const res = await fetch(`http://localhost:3000/meals?limit=${calorieLimit}`, fetchConfig).catch(e => console.error(`fetch error: ${e.message}`))
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
        <form className="calorie-form">
          <label>Calorie Limit</label>
          <div className="input-container">
            <input id="calorie-bound" type="number" min={100} max={2000} 
              onChange={handleOnChange}
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
            <button onClick={submitLimit}>Generate</button>
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
 * clean up TacoBell data
 * convert cheerio to jsdom
 * include other restaurants and add restaurant selector component
 * set veet as middleware between frontend and fastify???
 * convert everything to typescript for teh lulz
 * host???
 * try re-implementing FE with svelte and then vue for experimenting
 */