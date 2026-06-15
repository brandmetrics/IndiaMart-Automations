import { NextResponse } from "next/server";

import db from "@/app/lib/db";

export const dynamic =
  "force-dynamic";



export async function GET() {

  try {

    const [settings]: any =
      await db.query(

        `SELECT *
         FROM settings
         ORDER BY id ASC`

      );

    return NextResponse.json({

      success: true,

      settings,

    });

  } catch (error) {

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

