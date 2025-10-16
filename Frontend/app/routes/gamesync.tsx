import React from "react";
import GameOver from "~/components/gameOver";
import GameControl from "~/components/gameControl";
import Layout from "~/components/layout";
import Hud from "~/components/hud";
import type { KeyRow } from "~/types/keys";
import { generateSequence } from "~/utils/sequenceGenerator";

const rightKeys = ["j", "k", "l", ";"];
const leftKeys = ["a", "s", "d", "f"];

// keep a global counter so every KeyRow gets a unique index
let rowCounter = 0;



function keyRowsGenerator(sequence: number[], index: number): [KeyRow[], KeyRow[]] {
    const leftKeyRows: KeyRow[] = [];
    const rightKeyRows: KeyRow[] = [];

    for (let i = 0; i < 4; i++) {
        if (sequence[index + i] < 4) {
            let currentRow = Array(leftKeys.length).fill("");
            rightKeyRows.push({ index: rowCounter++, keys: [...currentRow] });
            currentRow[sequence[index + i]] = leftKeys[sequence[index + i]];
            leftKeyRows.push({ index: rowCounter++, keys: currentRow });
        } else {
            let currentRow = Array(rightKeys.length).fill("");
            leftKeyRows.push({ index: rowCounter++, keys: [...currentRow] });
            currentRow[sequence[index + i] - 4] = rightKeys[sequence[index + i] - 4];
            rightKeyRows.push({ index: rowCounter++, keys: currentRow });
        }
    }

    return [leftKeyRows.reverse(), rightKeyRows.reverse()];
}
export default function GameSync() {
    let sequence: number[] = React.useMemo(() => generateSequence(1000, 8), []);
    const [score, setScore] = React.useState(0);
    const [seqIdx, setSeqIndex] = React.useState(0);
    const [leftKeyRows, setLeftKeyRows] = React.useState<KeyRow[]>([]);
    const [rightKeyRows, setRightKeyRows] = React.useState<KeyRow[]>([]);
    const [status, setStatus] = React.useState<"playing" | "afk">("afk");
    const [showHint, setShowHint] = React.useState(true);
    const [gameOver, setGameOver] = React.useState(false);

    function handleTimeout() {
        setStatus("afk"); // or whatever you want to do when the timer ends
        console.log("Time is up!");
        setGameOver(true);
    }

    function updateSequence(indx: number) {
        const [leftRows, rightRows] = keyRowsGenerator(sequence, indx);
        setLeftKeyRows(leftRows);
        setRightKeyRows(rightRows);
    }

    React.useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if(e.key === " "&& status === "afk"){
                updateSequence(0);
                setStatus("playing");
                setShowHint(false);
            }
        };
        window.addEventListener("keyup", handleKeyUp);
        return () =>{
            window.removeEventListener("keyup", handleKeyUp);
        }

    }, []);;

    function onClicked(key: string, name: string) {
        // else if(status === "playing"){
        setSeqIndex((prevIdx) => {
            
            const expectedKeyIndx = sequence[prevIdx];
            let expectedKey = "";

            if (expectedKeyIndx < 4) {
                if(name !== "left") {
                    return prevIdx;
                }
                expectedKey = leftKeys[expectedKeyIndx];
            } else {
                if(name !== "right") {
                    return prevIdx;
                }
                expectedKey = rightKeys[expectedKeyIndx - 4];
            }
            // console.log(`Clicked: ${key}, Expected: ${expectedKey}`);

            if (key === expectedKey && status === "playing") {
                // console.log(name, " changin score")
                setScore((prevScore) => prevScore + 1);

                const newIdx = prevIdx + 1;
                // console.log(`Correct key! Sequence index: ${prevIdx} -> ${newIdx}`);

                const [leftRows, rightRows] = keyRowsGenerator(sequence, newIdx);
                setLeftKeyRows(leftRows);
                setRightKeyRows(rightRows);

                return newIdx;
            }

            return prevIdx;
        });
        // }
    }

    return (
        <Layout gamePage = {true} loginPage={false} leaderboardsPage={false} username="">
            <div
                className="relative"
                style={{ height: "calc(100vh - 4rem)" }}
            >
                {showHint && (
                <h1 className="flex justify-center items-center absolute text-3xl text-[lightgrey] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    Press "Space" to start!
                </h1>
                )}
                {gameOver && <GameOver score={score / 2} />}
                <div className="flex flex-1 gap-0">
                <div>
                    <Hud score={score} state={status} onTimeOut={handleTimeout} />
                </div>
                <div className="w-1/2">
                    <GameControl
                    onClicked={onClicked}
                    keyrows={leftKeyRows}
                    keys={leftKeys}
                    name="left"
                    status={status}
                    sequence={sequence}
                    />
                </div>
                <div className="w-1/2">
                    <GameControl
                    onClicked={onClicked}
                    keyrows={rightKeyRows}
                    keys={rightKeys}
                    name="right"
                    status={status}
                    sequence={sequence}
                    />
                </div>
                </div>
            </div>
        </Layout>
    );
}
