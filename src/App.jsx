import { useState } from 'react'
import './App.css'

function App() {
  const [ calorieLimit, setCalorieLimit ] = useState(100);
  const [ error, setError ] = useState('');
  const [ results, setResults ] = useState([])

  const submitLimit = async () => {
    if (calorieLimit) {
      const fetchConfig = {
        method: "GET",
      }

      const res = await fetch(`http://localhost:3000/meals?limit=${calorieLimit}`, fetchConfig)

      try {
        const data = await res.json()
        
        setResults(data.selectedItems)
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
                console.log({e})
                if (number < 100) {
                  setError("Calorie limit must be at least 100.")
                  return
                }

                if (number > 2000) {
                  setError("Calorie limit cannot exceed 2000.")
                  return
                }

                setError('')
                setCalorieLimit(number)
              }}
              value={calorieLimit}
            />
            <button onClick={submitLimit}>Generate</button>
          </div>
        <p>{error}</p>
        </div>
      </div>
      { 
        results && results.length > 0 ?
        <div>
          <ul>
              {results.map(r => <>
                <li>
                  <p>
                    {r.name}
                  </p>
                  <p>
                    {r.calories}
                  </p>
                  </li>
                </>)}
            </ul> 
        </div>
        : null
      }
    </>
  )
}

export default App

/**
 * TODO:
 * 1. better UX for calorie input
 * 2. output results as table component
 * 3. clean up TacoBell data
 * 4. better styling
 * 5. convert cheero to jsdom
 * 6. set veet as middleware between frontend and fastify???
 * 7. convert everything to typescript for teh lulz
 * 8. include other restaurants and add restaurant selector component
 * 9. host???
 * 10. try re-implementing FE with svelte and then vue for experimenting
 */