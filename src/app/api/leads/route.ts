import { NextRequest, NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(req: NextRequest) {

  const fromDate =
    req.nextUrl.searchParams.get("fromDate");

  const toDate =
    req.nextUrl.searchParams.get("toDate");

    const range =
  req.nextUrl.searchParams.get("range");

  const status =
  req.nextUrl.searchParams.get(
    "status"
  );
console.log("STATUS =", status);
  let query =
    "SELECT * FROM leads ";

  let params: any[] = [];

  if (range === "today") {

  query +=
    " WHERE DATE(created_at) = CURDATE()";

}

else if (
  range === "yesterday"
) {

  query +=
    " WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";

}

else if (
  range === "7days"
) {

  query +=
    " WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";

}

else if (
  range === "30days"
) {

  query +=
    " WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";

}

else if (
  range === "custom" &&
  fromDate &&
  toDate
) {

  query +=
    " WHERE DATE(created_at) BETWEEN ? AND ?";

  params.push(
    fromDate,
    toDate
  );
}

if (status === "yes") {

  query +=
    query.includes("WHERE")
      ? " AND useful_lead_status = 1"
      : " WHERE useful_lead_status = 1";
}

else if (status === "no") {

  query +=
    query.includes("WHERE")
      ? " AND useful_lead_status = 0"
      : " WHERE useful_lead_status = 0";
}

  query +=
    " ORDER BY created_at DESC";

  const [rows]: any =
    await db.query(
      query,
      params
    );

  return NextResponse.json(rows);
}
