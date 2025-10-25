import Button from "./Button";
import PenicillinLogo from "./PenicillinLogo";
import { useState, useEffect } from "react";

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
  
    function handleZoom() {
        setZoomed(true);
        document.body.style="overflow: hidden;"
        setTimeout(() => {
          //Change Page
        }, 2300);
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
