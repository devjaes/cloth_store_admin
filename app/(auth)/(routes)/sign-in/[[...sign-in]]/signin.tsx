"use client";
import { auth, useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { redirect } from 'next/navigation';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { isLoaded, signIn, setActive } = useSignIn();

    const { userId } = auth();

    if (userId) {
        redirect('/dashboard');
    }

    if (!isLoaded) {
        return null;
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (signIn) {
            await signIn
                .create({
                    identifier: email,
                    password,
                })
                .then((result) => {
                    if (result.status === "complete") {
                        console.log(result);
                        setActive({ session: result.createdSessionId });
                        redirect("/dashboard");
                    } else {
                        console.log(result);

                    }
                })
                .catch((err) => console.error("error", err.errors[0].longMessage));
        } else {
            console.log("no signIn");
        }
    }

    return (
        <>
            {/*<form onSubmit={submit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button>Sign in</button>
                </div>  
            </form>
            */}
            <div className="bg-gray-100 flex justify-center items-center h-screen">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat" alt="Placeholder Image" className="object-cover w-full h-full" />
                </div>
                <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold text-black mb-4">Login</h1>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600">Username</label>
                            <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="username"
                                name="username"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600">Password</label>
                            <input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    </form>
                    <div className="mt-6 text-blue-500 text-center">
                        <a href="#" className="hover:underline">Sign up Here</a>
                    </div>
                </div>
            </div>

        </>
    );
}