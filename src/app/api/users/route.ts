import { NextResponse }
from "next/server";

import type { NextRequest } from "next/server";
import db from "../../lib/db";
import bcrypt from "bcryptjs";
import { getAuthUser, isAdmin } from "../../lib/auth";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {

  try {
    if (!isAdmin(getAuthUser(request))) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        }
      );
    }

    const [users]: any =
      await db.query(

        `SELECT
          id,
          username,
          email,
          role
         FROM users
         ORDER BY id DESC`
      );

    return NextResponse.json({

      success: true,

      users,

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

export async function POST(
  request: NextRequest
) {

  try {
    if (!isAdmin(getAuthUser(request))) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        }
      );
    }

    const {
      username,
      email,
      password,
      role,
    } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email, and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!["admin", "user"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
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
          message: "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK EXISTING EMAIL

    const [existingUsers]: any =
      await db.query(

        "SELECT * FROM users WHERE email = ?",

        [email]
      );

    if (
      existingUsers.length > 0
    ) {

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

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // INSERT USER

    const [result]: any = await db.query(

      `INSERT INTO users
      (username,email,password,role)
      VALUES(?,?,?,?)`,

      [
        username,
        email,
        hashedPassword,
        role,
      ]
    );

    const [newUsers]: any = await db.query(
      `SELECT id, username, email, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [result.insertId]
    );

    return NextResponse.json({

      success: true,

      message:
        "User created successfully",

      user: newUsers[0],

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

