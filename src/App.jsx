import "./App.css";
import Penicillin from "./components/Penicillin";
import BadTrip from "./components/BadTrip";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Penicillin />} />
          <Route path="/badTrip" element={<BadTrip />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
