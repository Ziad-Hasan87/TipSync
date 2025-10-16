import Layout from "~/components/layout";

export default function Register() {
    function initiateRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // prevent page reload
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }
        
        console.log("Register initiated with:", { email, password });
    }

    return (
        <Layout gamePage={false} loginPage={true} leaderboardsPage={false} username="">
            <div
                className="relative"
                style={{ height: "calc(100vh - 4rem)" }}
            >
                <div className="flex items-center justify-center h-full">
                    <form
                        className="flex flex-col items-center justify-center gap-7 bg-slate-800 p-5 rounded w-96"
                        onSubmit={initiateRegister}
                    >
                        <h1 className="text-3xl text-blue-500">Register</h1>
                        
                        {/* Email */}
                        <div className="flex w-full items-center">
                            <label className="w-24 text-center pr-2" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className="flex-1 bg-[wheat] text-[black] p-1 rounded"
                                type="email"
                                id="email"
                                name="email"
                                required
                            />
                        </div>
                        
                        {/* Password */}
                        <div className="flex w-full items-center">
                            <label className="w-24 text-center pr-2" htmlFor="password">
                                Password:
                            </label>
                            <input
                                className="flex-1 bg-[wheat] text-[black] p-1 rounded"
                                type="password"
                                id="password"
                                name="password"
                                required
                            />
                        </div>

                        <button
                            className="bg-blue-500 text-white py-2 w-full rounded"
                            type="submit"
                        >
                            Register
                        </button>

                        <div>
                            Already have an account?{" "}
                            <a className="text-blue-400" href="/login">
                                Login here
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}