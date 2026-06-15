import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { getAuthUser, isAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id } = await context.params;

    const [result]: any =
    await db.query(

      "DELETE FROM users WHERE id = ?",

      [id]

    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({

      success: true,

      message:
        "User deleted successfully",

        result,

    });

  } catch (error) {

     console.log(error);

    return NextResponse.json(

      {
        success: false,
        message: "Server error",
      },

      {
        status: 500,
      }

    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id } = await context.params;

    const {
      username,
      email,
      role,
      password,
    } = await request.json();

    // PASSWORD UPDATE CASE

    if (password) {
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

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const [result]: any = await db.query(

        `UPDATE users
         SET password = ?
         WHERE id = ?`,

        [
          hashedPassword,
          id,
        ]

      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({

        success: true,

        message:
          "Password updated successfully",

      });

    }

    if (!username || !email || !["admin", "user"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid username, email, and role are required",
        },
        {
          status: 400,
        }
      );
    }

    const [existingUsers]: any = await db.query(
      "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
      [email, id]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    // NORMAL USER UPDATE

    const [result]: any = await db.query(

      `UPDATE users
       SET username = ?,
           email = ?,
           role = ?
       WHERE id = ?`,

      [
        username,
        email,
        role,
        id,
      ]

    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const [updatedUsers]: any = await db.query(
      `SELECT id, username, email, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return NextResponse.json({

      success: true,

      message:
        "User updated successfully",

      user: updatedUsers[0],

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
