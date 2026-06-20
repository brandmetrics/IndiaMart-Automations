import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET() {

  const [rows]: any =
    await db.query(
      "SELECT * FROM quick_replies ORDER BY id DESC"
    );

  return NextResponse.json(rows);
}

export async function POST(
  request: Request
) {

  const {

    reply_text,
  } = await request.json();

  await db.query(
    `
    INSERT INTO quick_replies
    (

      reply_text
    )
    VALUES
    (
      ?
    )
    `,
    [ reply_text]
  );

  return NextResponse.json({
    success: true,
  });

}

export async function PUT(
  request: Request
) {

  const {
    id, reply_text,
  } = await request.json();

  await db.query(
    `
    UPDATE quick_replies
    SET
      
      reply_text = ?
    WHERE id = ?
    `,
    [
      
      reply_text,
      id,
    ]
  );

  return NextResponse.json({
    success: true,
  });

}

export async function DELETE(
  request: Request
) {

  const {
    id,
  } = await request.json();

  await db.query(
    ` DELETE FROM quick_replies
    WHERE id = ?`,
    [id]
  );

  return NextResponse.json({
    success: true,
  });

}