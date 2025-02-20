"use client";

import { registrationSchema } from "@/lib/validationSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function Register() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState();
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
      const cpassword = formData.get("cpassword");
      registrationSchema.parse({ email, password, cpassword });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
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
    }
  }
  return (
    <div className="flex flex-col justify-center font-[sans-serif] mt-16">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">PhotoGallery</div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="text-red-500">{formErrors?.register}</div>
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
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Confirm Password
              </label>
              <input
                name="cpassword"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
              />
            </div>

            <div className="text-red-500">{formErrors?.cpassword}</div>
          </div>

          <div className="!mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Create an account
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
