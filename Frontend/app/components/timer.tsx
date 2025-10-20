import React from "react";

export default function Timer({
    status,
    onTimeout,
}: {
    status: "playing" | "afk" | "count-in";
    onTimeout?: () => void;
}) {
    const [seconds, setSeconds] = React.useState(0);
    const [milliseconds, setMilliseconds] = React.useState(0);

    React.useEffect(() => {
        if (status === "afk" || status === "count-in") {
            setSeconds(0);
            setMilliseconds(0);
            return;
        }

        if (status !== "playing") return;

        const interval = setInterval(() => {
            setMilliseconds((prev) => {
                if (prev >= 990) {
                    setSeconds((s) => s + 0.5);
                    return 0;
                }
                return prev + 10;
            });
        }, 10);

        return () => clearInterval(interval);
    }, [status]);

    React.useEffect(() => {
        if (seconds >= 60) {
            if (onTimeout) onTimeout();
        }
    }, [seconds, onTimeout]);

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
