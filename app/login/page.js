"use client";

import { loginSchema } from "@/lib/validationSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { z } from "zod";

export default function Login() {
  const [formErrors, setFormErrors] = useState();
  const router = useRouter();
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
      try {
        loginSchema.parse({ email, password });
      } catch (e) {
        if (e instanceof z.ZodError) {
          const newErrors = e.errors.reduce((acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          }, {});
          setFormErrors(newErrors);
        }
      }
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log(result);
      if (result.status === 200) {
        router.push("/");
      } else if (result.status === 401 && result.error === "No user found!") {
        setFormErrors((prevstate) => ({
          ...prevstate,
          login:
            "No account found with this email! Please sign up or try again.",
        }));
      }
    } catch (e) {}
  }
  return (
    <div className="flex flex-col justify-center font-[sans-serif] mt-16">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">PhotoGallery</div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="text-red-500">{formErrors?.login}</div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div className="text-red-500">{formErrors?.email}</div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
            </div>
            <div className="text-red-500">{formErrors?.password}</div>
          </div>

          <div className="!mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Login
            </button>
          </div>
          <p className="text-gray-800 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
