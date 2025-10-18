import KeyBoard from "./keyboard";
import KeySequence from "./keySequence";
import type { KeyRow } from "~/types/keys";

export default function GameControl({ 
    keys,
    keyrows, 
    name, 
    status,
    sequence, 
    onClicked
}: { 
    keys: string[], 
    keyrows: KeyRow[],
    name: string, 
    status: "playing" | "afk",
    sequence: number[], 
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
                <KeySequence keyrows={keyrows} />
            </div>
            <div className="absolute bottom-35 bg-[wheat] w-1/2 flex items-center justify-center z-50">
                <KeyBoard keys={keys} onClicked={onClicked} name={name} />
            </div>
        </div>
    )
}