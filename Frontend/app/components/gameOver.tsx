export default function GameOver( {score}: {score:number}){
    return(
        <div className="flex flex-col justify-center content-center absolute text-3xl text-[lightgrey] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 gap-5">
            Game Over! Your Score: {score}
            <button onClick={() => window.location.reload()} className="ml-4 p-2 bg-[wheat] text-black rounded">Restart</button>
        </div>
    )
}