import { NextRequest, NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(req: NextRequest) {

  const fromDate =
    req.nextUrl.searchParams.get("fromDate");

  const toDate =
    req.nextUrl.searchParams.get("toDate");

  let query =
    "SELECT * FROM leads";

  let params: any[] = [];

  if (fromDate && toDate) {

    query +=
      " WHERE DATE(created_at) BETWEEN ? AND ?";

    params.push(
      fromDate,
      toDate
    );
  }

  query +=
    " ORDER BY id DESC";

  const [rows]: any =
    await db.query(
      query,
      params
    );

  return NextResponse.json(rows);
}
