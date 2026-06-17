import { NextResponse } from "next/server";

import db from "@/app/lib/db";

export const dynamic =
  "force-dynamic";



export async function GET(
  request: Request
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const user_id =
      searchParams.get(
        "user_id"
      );

    if (!user_id) {

      return NextResponse.json(

        {
          success: false,
          message:
            "User id is required",
        },

        {
          status: 400,
        }

      );

    }

    const [filters]: any =
  await db.query(

    `SELECT
        filters.*,
        users.username AS user_name
     FROM filters
     LEFT JOIN users
     ON filters.user_id = users.id
     WHERE filters.user_id = ?
     ORDER BY filters.id DESC`,

    [user_id]

  );

    return NextResponse.json({

      success: true,

      filters,

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
  request: Request
) {

  try {

    const {
      user_id,
      filter_name,
    } = await request.json();

    if (!user_id || !filter_name) {

      return NextResponse.json(

        {
          success: false,
          message:
            "User id and filter name are required",
        },

        {
          status: 400,
        }

      );

    }

    const [result]: any =
      await db.query(

      `INSERT INTO filters
       (user_id, filter_name)
       VALUES (?, ?)`,

      [
        user_id,
        filter_name,
      ]

    );

    const [filters]: any =
      await db.query(

        `SELECT * FROM filters
         WHERE id = ?
         LIMIT 1`,

        [result.insertId]

      );

    return NextResponse.json({

      success: true,

      message:
        "Filter created successfully",

      filter:
        filters[0],

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
