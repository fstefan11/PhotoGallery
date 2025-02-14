import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";
import { hashPassword } from "@/lib/auth";
import { registrationSchema } from "@/lib/validationSchema";

export const POST = async (request) => {
  const { email, password, cpassword } = await request.json();

  try {
    registrationSchema.parse({ email, password, cpassword });
  } catch (e) {
    const errors = e.errors.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    const response = NextResponse.json(
      {
        message: errors,
      },
      {
        status: 400,
      }
    );

    return response;
  }

  if (password != cpassword)
    return NextResponse.json(
      { message: "Passwords do not match. Please try again." },
      {
        status: 400,
      }
    );

  await dbConnect();

  const hashedPassword = await hashPassword(password);

  const newUser = {
    userName: email,
    email: email,
    password: hashedPassword,
  };
  try {
    await createUser(newUser);
  } catch (err) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  return new NextResponse("User has been created", {
    status: 201,
  });
};
