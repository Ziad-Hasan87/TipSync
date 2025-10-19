import Layout from "~/components/layout";
export default function Difficulty(){

    return(
        <Layout loginPage={false} profilePage={true} leaderboardsPage={true} gamePage={false}>
            <div className="flex flex-col items-center justify-center gap-6"
                style={{ height: "calc(100vh - 4rem)" }}
            >
                <button 
                    className="text-white py-3 text-5xl px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-blue-700 active:bg-blue-900"
                    onClick={()=>window.location.href="/gamesync"}
                    >
                    Easy Mode!
                    </button>
                    <button 
                    className="text-white text-5xl py-3 px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-blue-700 active:bg-blue-900"
                    onClick={()=>window.location.href="/gamesync-hard"}
                    >
                    Hard Mode!
                </button>
            </div>
        </Layout>
    )
}