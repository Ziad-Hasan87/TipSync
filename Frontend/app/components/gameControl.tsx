import KeyBoard from "./keyboard";
import KeySequence from "./keySequence";
import type { KeyRow } from "~/types/keys";
import { type Easing, easeInOut } from "framer-motion";


export default function GameControl({ 
    keys,
    keyrows, 
    name, 
    status,
    myKey,
    sequence,
    active,
    ease,
    duration,
    onClicked
}: { 
    keys: string[], 
    keyrows: KeyRow[],
    name: string, 
    status: "playing" | "afk" | "count-in",
    sequence: number[], 
    active: number,
    myKey:boolean,
    ease:boolean,
    duration:number,
    onClicked?: (key: string, name: string) => void 
}) {

    if(status === "afk"){
        return (
            <></>
        )
    }

    return (
        <div className="w-full h-full">
            <div className="absolute bottom-55 w-1/2 flex items-center justify-center p-4 shadow-md z-10">    
                <KeySequence duration={duration} keyrows={keyrows} />
            </div>
            <div className="absolute bottom-35 bg-[darkcyan] w-1/2 flex items-center justify-center z-50">
                <KeyBoard myKey={myKey} active={active} keys={keys} onClicked={onClicked} name={name} />
            </div>
        </div>
    )
}