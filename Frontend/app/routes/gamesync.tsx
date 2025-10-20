import React from "react";
import GameOver from "~/components/gameOver";
import GameControl from "~/components/gameControl";
import Layout from "~/components/layout";
import Hud from "~/components/hud";
import type { KeyRow } from "~/types/keys";
import { generateSequence } from "~/utils/sequenceGenerator";

const rightKeys = ["j", "k", "l", ";"];
const leftKeys = ["a", "s", "d", "f"];
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
    const sequence: number[] = React.useMemo(() => generateSequence(1000, 8), []);
    const [score, setScore] = React.useState(0);
    const [missCount, setMissCount] = React.useState(0);
    const [seqIdx, setSeqIndex] = React.useState(0);
    const [leftKeyRows, setLeftKeyRows] = React.useState<KeyRow[]>([]);
    const [rightKeyRows, setRightKeyRows] = React.useState<KeyRow[]>([]);
    const [status, setStatus] = React.useState<"playing" | "afk" | "count-in">("afk");
    const [showHint, setShowHint] = React.useState(true);
    const [gameOver, setGameOver] = React.useState(false);
    const [tempo] = React.useState(95);
    const [accuracy, setAccuracy] = React.useState(0);
    const unitTime = 60000 / tempo;
    const [beatCounter, setBeatCounter] = React.useState(0);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const currentKeyRef = React.useRef(0);
    const hitRef = React.useRef(false);
    const metronomeAudioRef = React.useRef<HTMLAudioElement | null>(null);
    const [myKey1, setMyKey1] = React.useState(false);
    const [myKey2, setMyKey2] = React.useState(false);
    const [active, setActive] = React.useState(10);

    React.useEffect(() => {
        metronomeAudioRef.current = new Audio("/sounds/metronome-click2.mp3");
    }, []);

    React.useEffect(() => {
        const currentKey = sequence[seqIdx];
        setActive(currentKey % 4);
        setMyKey1(currentKey < 4);
        setMyKey2(currentKey >= 4);
    }, [seqIdx]);

    React.useEffect(() => {
        if (!metronomeAudioRef.current) return;

        if (status === "afk") {
            const targetVolume = 0;
            const step = 0.01;
            let rafId: number;

            const fade = () => {
                if (!metronomeAudioRef.current) return;
                const current = metronomeAudioRef.current.volume;

                if (Math.abs(current - targetVolume) < step) {
                    metronomeAudioRef.current.volume = targetVolume;
                    return;
                }

                metronomeAudioRef.current.volume += current < targetVolume ? step : -step;
                rafId = requestAnimationFrame(fade);
            };

            fade();

            return () => cancelAnimationFrame(rafId);
        }
        if (status === "playing") {
            metronomeAudioRef.current.volume = 1;
        }
    }, [status]);

    function playMetronome() {
        if (metronomeAudioRef.current) {
            metronomeAudioRef.current.currentTime = 0;
            metronomeAudioRef.current.play().catch(() => {});
        }
    }

    function handleTimeout() {
        setStatus("afk");
        setGameOver(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }

    function updateSequence(idx: number) {
        const [leftRows, rightRows] = keyRowsGenerator(sequence, idx);
        setLeftKeyRows(leftRows);
        setRightKeyRows(rightRows);
        currentKeyRef.current = idx > 0 ? sequence[idx] : sequence[idx];
        hitRef.current = false;
    }

    function nextKey() {
        if (!hitRef.current) {
            setMissCount((prev) => prev + 1);
        }

        setSeqIndex((prev) => {
            const newIdx = prev + 1;
            setBeatCounter((prev) => prev + 0.5);
            updateSequence(newIdx);
            return newIdx;
        });
    }

    React.useEffect(() => {
        const totalBeats = score + missCount;
        if (totalBeats === 0) {
            setAccuracy(0);
        } else {
            const acc = (score / beatCounter) * 100;
            setAccuracy(parseFloat(acc.toFixed(2)));
        }
    }, [score, missCount]);

    React.useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === " " && status === "afk") {
                setStatus("count-in");
                setShowHint(false);

                const countInBeats = 4;
                let beatCount = 0;

                const countInInterval = setInterval(() => {
                    beatCount++;

                    if (beatCount >= countInBeats) {
                        clearInterval(countInInterval);
                        setTimeout(() => {
                            setStatus("playing");
                            updateSequence(0);
                            intervalRef.current = setInterval(nextKey, unitTime);
                        }, unitTime);
                    }
                }, unitTime);
                playMetronome();
            }
        };

        window.addEventListener("keyup", handleKeyUp);
        return () => window.removeEventListener("keyup", handleKeyUp);
    }, [status]);


    function onClicked(key: string, name: string) {
        if (hitRef.current) return;

        const expectedKeyIdx = currentKeyRef.current;
        let expectedKey = "";

        if (expectedKeyIdx < 4) {
            if (name !== "left") return;
            expectedKey = leftKeys[expectedKeyIdx];
        } else {
            if (name !== "right") return;
            expectedKey = rightKeys[expectedKeyIdx - 4];
        }

        if (status !== "playing") return;

        if (key === expectedKey) {
            setScore((prev) => prev + 1);
        } else {
            setMissCount((prev) => prev + 1);
        }

        hitRef.current = true;
    }

    return (
        <Layout gamePage={false} loginPage={false} leaderboardsPage={true} profilePage={true}>
            <div className="relative" style={{ height: "calc(100vh - 4rem)" }}>
                {showHint && (
                    <h1 className="flex justify-center items-center absolute text-3xl text-[lightgrey] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        Press "Space" to start!
                    </h1>
                )}
                {gameOver && <GameOver difficulty={"easy"} score={score} mode={"sync"} accuracy={accuracy} />}
                <div className="flex flex-1 gap-0">
                    <div>
                        <Hud
                            accuracyFlag={true}
                            accuracy={accuracy}
                            score={score}
                            state={status}
                            onTimeOut={handleTimeout}
                        />
                    </div>
                    <div className="w-1/2">
                        <GameControl
                            active={active}
                            myKey={myKey1}
                            ease={true}
                            duration={0.2}
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
                            active={active}
                            myKey={myKey2}
                            ease={true}
                            duration={0.2}
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
