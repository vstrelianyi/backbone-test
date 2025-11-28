"use server";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/supabase/supabase-server";

const createPayloadSchema = z.object({
  orgId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
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

  let payload: z.infer<typeof createPayloadSchema>;
  try {
    const body = await request.json().catch(() => ({}));
    payload = createPayloadSchema.parse(body ?? {});
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid request body",
        details: error instanceof Error ? error.message : error,
      },
      { status: 400 }
    );
  }

  const ticketRecord = {
    id: randomUUID(),
    org_id: payload.orgId ?? randomUUID(),
    last_message: "",
    urgency: 1,
    importance: 1,
    sentiment: "neutral",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tickets")
    .insert(ticketRecord)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to create ticket",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "ok",
    ticket: data,
  });
}

