import React from "react";
import Timer from "./timer";
import Score from "./score";

export default function Hud({ state, score=0, onTimeOut}: { state: "playing" | "afk" , score:number, onTimeOut?: () => void }) {

    return (
        <div className="absolute top-20 left-0 w-full flex justify-center p-4 z-50">
            <div className="flex flex-col items-center text-lg font-bold orbitron-regular bg-[wheat] bg-opacity-50 text-black px-4 py-2 rounded">
                <Timer status={state} onTimeout={onTimeOut}/>
                <Score score={score} />
            </div>
        </div>
    );
}