import Button from "./Button";
import PenicillinLogo from "./PenicillinLogo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GetPenicillinOClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time.toLocaleTimeString();
}

function PenicillinClock({ onClick }) {
  return (
    <div>
      It's Peniciliin o'clock: {GetPenicillinOClock()}
      <br />
      <Button onClick={onClick} />
    </div>
  );
}
export default function Penicillin() {
  const [zoomed, setZoomed] = useState(false);

  const navigate = useNavigate();

  function handleZoom() {
    setZoomed(true);
    document.body.style = "overflow: hidden;";
    setTimeout(() => {
      navigate("/badTrip");
    document.body.style = "";

    }, 1600);
  }
  return (
    <>
      <div className={zoomed ? "zoom" : ""}>
        <div>
          <PenicillinLogo manualTrigger={zoomed} />
        </div>
        <h1>PenicillinTester</h1>
        <div className="card">
          <p>
            <PenicillinClock onClick={handleZoom} />
          </p>
        </div>
      </div>
    </>
  );
}
