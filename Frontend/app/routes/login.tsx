import toast from "react-hot-toast";
import Layout from "~/components/layout";
import React from "react";

export default function Login() {
    React.useEffect(()=>{
        document.title = "Log in";
    },[])
    async function initiateLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // prevent page reload
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        if (!email || !password) {
            toast.error("Please fill in both email and password.");
            return;
        }
        try {
            const res = await fetch("http://127.0.0.1:8000/auth/login",{
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("access_token", data.access_token);
                toast.success(data.message);
                window.location.href = "/gamesync";
            }
            else {
                toast.error("Login failed. Please check your credentials.");
            }
            
        } catch (error) {
            
        }
        console.log("Login initiated with:", { email, password });
    }

    return (
        <Layout gamePage={false} loginPage={true} leaderboardsPage={false} profilePage={false}>
            <div
                className="relative"
                style={{ height: "calc(100vh - 4rem)" }}
            >
                <div className="flex items-center justify-center h-full">
                    <form
                        className="flex flex-col items-center justify-center gap-7 bg-slate-800 p-5 rounded w-96"
                        onSubmit={initiateLogin}
                    >
                        <h1 className="text-3xl text-blue-500">Login</h1>
                        
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
                            Login
                        </button>

                        <div>
                            Don't have an account?{" "}
                            <a className="text-blue-400" href="/register">
                                Register here
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
