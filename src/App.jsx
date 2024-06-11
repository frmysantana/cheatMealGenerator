import { useState } from 'react'
import './App.css'

function App() {
  

  return (
    <>
      <h1>Cheat Meal Generator</h1>
      <div className="card">
        <p>Please enter an upper calorie bound for your cheat meal (the maximum is 2000).</p>
        <input id="calorie-bound" type="number" min={100} max={2000}></input>
      </div>
    </>
  )
}

export default App
