import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  if (!query) {
    const results = await db.select().from(advocates);
    return Response.json({ data: results });
  }

  const terms = query.split(/\s+/);

  // Cast yearsOfExperience and phoneNumber to text
  const whereClauses = terms.map((term) => sql`
    (
      LOWER(${advocates.firstName}) LIKE '%' || ${term} || '%' OR
      LOWER(${advocates.lastName}) LIKE '%' || ${term} || '%' OR
      LOWER(${advocates.city}) LIKE '%' || ${term} || '%' OR
      LOWER(${advocates.degree}) LIKE '%' || ${term} || '%' OR
      LOWER(CAST(${advocates.yearsOfExperience} AS TEXT)) LIKE '%' || ${term} || '%' OR
      LOWER(CAST(${advocates.phoneNumber} AS TEXT)) LIKE '%' || ${term} || '%' OR
      (
        jsonb_typeof(${advocates.specialties}) = 'array' AND
        EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${advocates.specialties}) AS s
          WHERE LOWER(s) LIKE '%' || ${term} || '%'
        )
      )
    )
  `);

  // Combine all clauses with AND (all words must match)
  const where = and(...whereClauses);

  const results = await db
    .select()
    .from(advocates)
    .where(where);

  return Response.json({ data: results ?? [] });
}
