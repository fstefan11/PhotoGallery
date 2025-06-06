"use client";

import Spinner from "@/components/loading/spinner";
import { registrationSchema } from "@/lib/validationSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function Register() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event) {
    setLoading(true);
    setFormErrors();
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      const cpassword = formData.get("cpassword");
      registrationSchema.parse({ email, username, password, cpassword });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          cpassword,
        }),
      });

      if (response.status === 400) {
        const errorMessage = await response.text();
        setFormErrors((prevstate) => ({
          ...prevstate,
          register: errorMessage,
        }));
      }

      if (response.status === 201) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result.status === 200) {
          router.push("/");
          router.refresh();
        }
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
            <div className="text-red-500">{formErrors?.register}</div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email address
                <div className="text-red-500">{formErrors?.email}</div>
              </label>
              <input
                name="email"
                type="email"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Username
                <div className="text-red-500">{formErrors?.username}</div>
              </label>
              <input
                name="username"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
                <div className="text-red-500">{formErrors?.password}</div>
              </label>
              <input
                name="password"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Confirm Password
                <div className="text-red-500">{formErrors?.cpassword}</div>
              </label>
              <input
                name="cpassword"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
              />
            </div>
          </div>

          <div className="!mt-8">
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex justify-center items-center"
            >
              {loading ? <Spinner /> : "Create an account"}
            </button>
          </div>
          <p className="text-gray-800 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
