"use client";

import Spinner from "@/components/loading/spinner";
import { loginSchema } from "@/lib/validationSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { z } from "zod";

export default function Login() {
  const [formErrors, setFormErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      setFormErrors();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      loginSchema.parse({ email, password });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.status === 200) {
        router.push("/");
        router.refresh();
      } else if (result.status === 401 && result.error === "No user found!") {
        setFormErrors((prevstate) => ({
          ...prevstate,
          login:
            "No account found with this email! Please sign up or try again.",
        }));
      } else if (result.status === 401) {
        setFormErrors((prevstate) => ({
          ...prevstate,
          login: "Invalid credentials. Please try again.",
        }));
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors = e.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setFormErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col justify-center">
      <div className="w-full mx-auto max-w-md bg-white border border-gray-200 rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          PhotoGallery
        </h2>

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
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? <Spinner /> : "Login"}
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
