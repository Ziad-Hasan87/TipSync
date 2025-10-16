import KeyButton from "~/components/keybutton";
import * as React from "react";

export default function KeyBoard({ keys, onClicked, name }: { keys: string[], onClicked?: (key: string, name: string) => void, name: string }) {
    const keyStyle = "key-border";
    const clickStyle = "key-border-hit";

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const element = document.getElementById(key);
            if (element) {
                element.className = clickStyle;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const element = document.getElementById(key);
            if (element) {
                element.className = keyStyle;
            }
            onClicked?.(key, name);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <>
            {keys.map((key, idx) => (
                <div className={keyStyle} id={key || `empty-${idx}`} key={key || `empty-${idx}`}>
                    <KeyButton className="key-button">{key.toUpperCase()}</KeyButton>
                </div>
            ))}
        </>
    );
}