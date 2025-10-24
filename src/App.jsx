import { useState } from 'react'
import './App.css'
import Penicillin  from "./components/Penicillin";
import PenicillinLogo from './components/PenicillinLogo'

function App() {
  return (
    <>
      <div>
        <PenicillinLogo />
      </div>
      <h1>PenicillinTester</h1>
      <div className="card">
        <p>
          <Penicillin />
        </p>
      </div>
    </>
  )
}

export default App
