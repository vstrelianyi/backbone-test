"use server";

import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/supabase/supabase-server";

const payloadSchema = z.object({
  ticketId: z.string().uuid(),
  message: z.string().min(1, "Message cannot be empty"),
});

const URGENCY_KEYWORDS = ["water", "leak"];
const NEGATIVE_KEYWORDS = ["angry", "upset"];

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

  let payload: z.infer<typeof payloadSchema>;
  try {
    payload = payloadSchema.parse(await request.json());
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

  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", payload.ticketId)
    .single();

  if (ticketError) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to fetch ticket",
        details: ticketError.message,
      },
      { status: ticketError.code === "PGRST116" ? 404 : 500 }
    );
  }

  const lowerMessage = payload.message.toLowerCase();

  const urgency = URGENCY_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  )
    ? 3
    : 1;

  const importance = payload.message.length > 200 ? 2 : 1;

  const sentiment = NEGATIVE_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  )
    ? "negative"
    : "neutral";

  const { data: updatedTicket, error: updateError } = await supabase
    .from("tickets")
    .update({
      last_message: payload.message,
      urgency,
      importance,
      sentiment,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.ticketId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to update ticket",
        details: updateError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "ok",
    updated: true,
    ticket: updatedTicket ?? ticket,
  });
}
