
import { NextResponse } from "next/server";
import db from "../../lib/db";
import validator from "validator";
import bcrypt from "bcryptjs";



export async function POST(
  request: Request
) {

  try {



const {
  username,
  email,
  password,

} = await request.json();




// EMAIL VALIDATION

if (
  !validator.isEmail(
    email || ""
  )
) {

  return NextResponse.json(
    {
      success: false,
      message:
        "Invalid email format",
    },
    {
      status: 400,
    }
  );
}




if (password.length < 6) {

  return NextResponse.json(
    {
      success: false,
      message:
        "Password must be at least 6 characters",
    },
    {
      status: 400,
    }
  );
}



// HASH PASSWORD

const hashedPassword =
  await bcrypt.hash(
    password,
    10
  );

// CHECK IF EMAIL ALREADY EXISTS

const [existingUsers]: any =
  await db.query(

    "SELECT * FROM users WHERE email = ?",

    [email]
  );

if (existingUsers.length > 0) {

  return NextResponse.json(
    {
      success: false,
      message:
        "Email already exists",
    },
    {
      status: 400,
    }
  );
}

await db.query(

  `INSERT INTO users
  (username,email,password,role)
  VALUES(?,?,?,?)`,

  [
    username,
    email,
    hashedPassword,
    "user",
  ]
);





return NextResponse.json({

  success: true,

  message:
    "User registered successfully",

});


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


