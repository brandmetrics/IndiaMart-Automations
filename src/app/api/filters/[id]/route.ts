import { NextResponse } from "next/server";

import db from "@/app/lib/db";

export const dynamic =
  "force-dynamic";



export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const [result]: any =
      await db.query(

      "DELETE FROM filters WHERE id = ?",

      [id]

    );

    if (result.affectedRows === 0) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Filter not found",
        },

        {
          status: 404,
        }

      );

    }

    return NextResponse.json({

      success: true,

      message:
        "Filter deleted successfully",

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



export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const {
      filter_name,
    } = await request.json();

    if (!filter_name) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Filter name is required",
        },

        {
          status: 400,
        }

      );

    }

    const [result]: any =
      await db.query(

      `UPDATE filters
       SET filter_name = ?
       WHERE id = ?`,

      [
        filter_name,
        id,
      ]

    );

    if (result.affectedRows === 0) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Filter not found",
        },

        {
          status: 404,
        }

      );

    }

    const [filters]: any =
      await db.query(

        `SELECT * FROM filters
         WHERE id = ?
         LIMIT 1`,

        [id]

      );

    return NextResponse.json({

      success: true,

      message:
        "Filter updated successfully",

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
