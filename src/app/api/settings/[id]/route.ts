import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function PUT(
  request: Request,
  { params }: any
) {

  try {

    const id = params.id;

    const {
      setting_value,
    } = await request.json();

    await db.query(

      `UPDATE settings
       SET setting_value = ?
       WHERE id = ?`,

      [
        setting_value,
        id,
      ]

    );

    return NextResponse.json({

      success: true,

      message:
        "Setting updated successfully",

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