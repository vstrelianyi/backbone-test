"use server";

import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/supabase/supabase-server";

export async function GET() {
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase server credentials are missing",
        details:
          error instanceof Error ? error.message : "Unknown configuration error",
      },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to fetch tickets",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "ok",
    tickets: data ?? [],
  });
}

