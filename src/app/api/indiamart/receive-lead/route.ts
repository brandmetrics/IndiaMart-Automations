import { NextRequest, NextResponse }
from "next/server";

import db from "../../../lib/db";

export async function POST(
  req: NextRequest
) {
try{
  const body = await req.json();
  console.log("BODY RECEIVED:", body);

  const queryMessage =
  body.query_message || "";

  const [filters]: any =
  await db.query(
    "SELECT * FROM filters"
  );

  let usefulLeadStatus = 0;

  for (const filter of filters) {

  const keyword =
    filter.filter_name.toLowerCase();

  if (
    queryMessage
      .toLowerCase()
      .includes(keyword)
  ) {

    usefulLeadStatus = 1;

    break;
  }
}

console.log("Before INSERT");

await db.query(
`
INSERT INTO leads
(
  unique_id,
  name,
  email,
  phone,
  query_message,
  useful_lead_status
)
VALUES (?, ?, ?, ?, ?, ?)
`,
[
  body.unique_id,
  body.name,
  body.email,
  body.phone,
  body.query_message,
  usefulLeadStatus
]
);
console.log("After INSERT");

 return NextResponse.json({
      success: true
    });
  
} catch(error){
    console.error("ERROR:", error);

  return NextResponse.json({
    success: false,
    error: String(error)
  },
{ status: 500 }
);
}
}