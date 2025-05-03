import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";
import { hashPassword } from "@/lib/auth";
import { registrationSchema } from "@/lib/validationSchema";
import { User } from "@/model/user-model";

export const POST = async (request) => {
  const { email, username, password, cpassword } = await request.json();

  try {
    registrationSchema.parse({ email, username, password, cpassword });
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

  await dbConnect();

  const user = await User.findOne({ $or: [{ email }, { userName: username }] });
  if (user) {
    const conflictedField = user.email === email ? "Email" : "Username";
    return new NextResponse(`${conflictedField} already exists!`, {
      status: 400,
    });
  } else {
    const hashedPassword = await hashPassword(password);

    const newUser = {
      userName: username,
      email: email,
      password: hashedPassword,
    };
    try {
      await createUser(newUser);
    } catch (err) {
      console.log(err.message);
      return new NextResponse(err.message, {
        status: 500,
      });
    }

    return new NextResponse("User has been created", {
      status: 201,
    });
  }
};
