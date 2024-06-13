import { useState } from 'react'
import './App.css'

function App() {
  const [ calorieLimit, setCalorieLimit ] = useState(100);
  const [ error, setError ] = useState('');

  const submitLimit = () => {
    console.log(`should be submitting... ${calorieLimit}`)
    if (calorieLimit) {
      fetch(`/meals?limit=${calorieLimit}`)
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
    </>
  )
}

export default App
