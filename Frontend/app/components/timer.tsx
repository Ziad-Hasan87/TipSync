import React from "react";

export default function Timer({ status }: { status: "playing" | "afk" }) {
    const [seconds, setSeconds] = React.useState(0);
    const [milliseconds, setMilliseconds] = React.useState(0);

    React.useEffect(() => {
        if (status !== "playing" || seconds >= 60) return;

        const interval = setInterval(() => {
            setMilliseconds((prev) => {
                if (prev >= 999) {
                    setSeconds((s) => s + 1);
                    return 0;
                }
                return prev + 10;
            });
        }, 10);

        return () => clearInterval(interval);
    }, [status, seconds]);

    React.useEffect(() => {
        if (seconds >= 60) {
            setMilliseconds(0);
        }
    }, [seconds]);

    return (
        <div>
            {seconds < 60
                ? `${seconds.toString().padStart(2, "0")}:${(milliseconds / 10)
                      .toFixed(0)
                      .padStart(2, "0")}`
                : "01:00"}
        </div>
    );
}