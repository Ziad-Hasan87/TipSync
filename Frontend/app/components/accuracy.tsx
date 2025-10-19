export default function Accuracy({ accuracy }: { accuracy: number }) {
    const displayAccuracy = isNaN(accuracy) || !isFinite(accuracy) ? 0 : accuracy;
    return (
        <div>
            Accuracy: {displayAccuracy}%
        </div>
    );
}
