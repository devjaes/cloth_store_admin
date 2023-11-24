"use client";
import { auth, useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { redirect } from "next/navigation";
import LogoAmbivalence from "@/public/LogoAmbivalence.png";
import Image from "next/image";
import Background from "@/public/bg_fish2.jpg";
import Error from "next/error";
import { Amarante } from "next/font/google";
import { url } from "inspector";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoaded, signIn, setActive } = useSignIn();

  const BackgroundStyle = {
    backgroundImage: "url(" + Background.src + ")",
    backgroundPosition: "center",

  };

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
        .catch((err) => console.error("error", err));
    } else {
      console.log("no signIn");
    }
  }

  return (
    <div style={BackgroundStyle} className="w-screen h-screen grid place-items-center">
      <div className="bg-white flex justify-center items-center h-1/2 w-auto rounded-3xl ">
        <div className=" hidden lg:grid bg-cyan-500 rounded-l-3xl flex-1 px-10 h-full place-items-center">
          <Image
            src={LogoAmbivalence}
            alt="Logo-Ambivalence"
            className=" w-3/4"
          />
        </div>
        <div className="lg:p-20 md:p-52 sm:20 p-10 w-full flex-1 ">
          <h1 className="text-3xl font-semibold text-black mb-4">Login</h1>
          <form onSubmit={submit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">
                Usuario
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
