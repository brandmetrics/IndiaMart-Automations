
import { NextResponse } from "next/server";
import db from "../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(
  request: Request
) {

  try {

    // GET DATA FROM FRONTEND

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    

    

    //   Check- Does this user exist?
const [users]: any =
  await db.query(

    "SELECT id, username, email, password, role FROM users WHERE email = ? LIMIT 1",

    [email]
  );

if (users.length === 0) {

  return NextResponse.json(
    {
      success: false,
      message:
        "User not found",
    },
    {
      status: 400,
    }
  );
}

// Comparing the password with hashed password 
const user = users[0];

const isPasswordCorrect =
  await bcrypt.compare(
    password,
    user.password
  );

if (!isPasswordCorrect) {

  return NextResponse.json(
    {
      success: false,
      message:
        "Invalid password",
    },
    {
      status: 400,
    }
  );
}

// Token identifies user securely
const token = jwt.sign(

  {
    id: user.id,
    role: user.role,
  },

  process.env.JWT_SECRET!,

  {
    expiresIn: "7d",
  }

);



   

const response =
  NextResponse.json({

    success: true,

    message:
      "Login successful",

    user: {

  id: user.id,

  username:
    user.username,

  email:
    user.email,

  role:
    user.role,

},

  });

response.cookies.set(
  "token",
  token,
  {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  }
);


return response;


  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}
