import Button from "./Button";
import { useState, useEffect } from "react";

function GetPenicillinOClock() {
  const [time, setTime] = useState(new Date());
    
  useEffect(() =>{
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  return time.toLocaleTimeString();
}

export default function Penicillin() {
  return (
    <div>
      It's Peniciliin o'clock: {GetPenicillinOClock()}
      <br />
      <Button />
    </div>
  );
}
