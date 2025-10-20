import KeyButton from "~/components/keybutton";
import * as React from "react";

export default function KeyBoard({
    myKey,
    active,
    keys,
    onClicked,
    name
}: {
    myKey: boolean;
    active: number;
    keys: string[];
    onClicked?: (key: string, name: string) => void;
    name: string;
}) {
    const keyStyle = "key-border";
    const clickStyle = "key-border-hit";
    const missStyle = "key-border-miss";
    const toClickStyle = "key-border-need";

    // store both the pressed key and the active key at that moment
    const pressedInfoRef = React.useRef<{ key: string; targetKey: string } | null>(null);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const element = document.getElementById(`${name}-${key}`);
            if (!element) return;

            pressedInfoRef.current = { key, targetKey: keys[active] };

            if (key === keys[active] && myKey) {
                element.className = clickStyle;
            } else {
                element.className = missStyle;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const element = document.getElementById(`${name}-${key}`);
            if (!element) return;

            const pressedInfo = pressedInfoRef.current;
            const wasActiveKey = pressedInfo?.key === key && pressedInfo?.targetKey === key && myKey;

            if (wasActiveKey) {
                // only restore to toClickStyle if still the current target
                const isStillTarget = keys[active] === key;
                element.className = isStillTarget ? toClickStyle : keyStyle;
            } else {
                element.className = keyStyle;
            }

            pressedInfoRef.current = null;
            onClicked?.(key, name);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [keys, active, myKey, onClicked, name]);

    return (
        <>
            {keys.map((key, idx) => (
                <div
                    className={myKey && idx === active ? toClickStyle : keyStyle}
                    id={`${name}-${key}`}
                    key={key || `empty-${idx}`}
                >
                    <KeyButton className="key-button">
                        {key.toUpperCase()}
                    </KeyButton>
                </div>
            ))}
        </>
    );
}
