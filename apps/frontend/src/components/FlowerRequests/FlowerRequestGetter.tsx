import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlowerRequestDisplay } from "./FlowerRequestDisplay.tsx";
import { flowerform } from "../common/flowerform.ts";

export function FlowerRequestGetter() {
  const [flowerRequestData, setFlowerRequestData] = useState<flowerform[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/flower-request");
      setFlowerRequestData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  return (
    <div className="flex flex-colgap-5">
      {flowerRequestData != undefined ? (
        flowerRequestData.map((flowerform) => {
          return (
            <FlowerRequestDisplay
              flowerform={flowerform}
            ></FlowerRequestDisplay>
          );
        })
      ) : (
        <>no</>
      )}
    </div>
  );
}
