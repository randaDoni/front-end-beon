import "./sudahBayar.scss";
import { useEffect, useState } from "react";
import { topDealUsers } from "../../data.ts";

const SudahBayar = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sudahBayar">
      <h1>Hallo Pak RT</h1>
      <p>Saat ini sedang jam <strong>{currentTime}</strong></p>

    </div>
  );
};

export default SudahBayar;
