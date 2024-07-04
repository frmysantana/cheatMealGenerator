import { useState } from 'react'
import './App.css'
import Results from './Results';
import Error from './Error';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [ calorieLimit, setCalorieLimit ] = useState(100);
  const [ error, setError ] = useState('');
  const [ results, setResults ] = useState([])

  const submitLimit = async () => {
    if (!calorieLimit) {
      setError('Please set a calorie limit between 100 and 2000 Calories.')
      return
    } else if (calorieLimit > 100 && calorieLimit < 2000) {
      setError('')
      const fetchConfig = {
        method: "GET",
      }

      const res = await fetch(`http://localhost:3000/meals?limit=${calorieLimit}`, fetchConfig)

      try {
        const data = await res.json()
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
        <div>
          <div>
            <input id="calorie-bound" type="number" min={100} max={2000} 
              onChange={(e) => {
                const number = +e.target.value;
                if (number < 100) {
                  setError("Calorie limit must be at least 100.")
                }

                if (number > 2000) {
                  setError("Calorie limit cannot exceed 2000.")
                }

                setCalorieLimit(number)
              }}
              value={calorieLimit}
            />
            <button onClick={submitLimit}>Generate</button>
          </div>
          <Error message={error} />
        </div>
      </div>
      <Results results={results} />
    </>
  )
}

export default App

/**
 * TODO:
 * try form actions
 * clean up TacoBell data
 * better styling
 * convert cheero to jsdom
 * set veet as middleware between frontend and fastify???
 * convert everything to typescript for teh lulz
 * include other restaurants and add restaurant selector component
 * host???
 * try re-implementing FE with svelte and then vue for experimenting
 */