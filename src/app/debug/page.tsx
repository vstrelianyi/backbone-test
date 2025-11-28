"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormTicketReply } from "@/components/Forms/FormTIcketReply";
import { ListTickets } from "@/components/Lists/ListTickets";

export default function PageDebug() {
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <ListTickets onTicketSelect={setSelectedTicketId} />

      <Card>
        <CardHeader>
          <CardTitle>Ticket reply debugger</CardTitle>
          <CardDescription>
            Send mock tenant messages to the enrichment endpoint and inspect the
            response payload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Need a new ticket?</p>
                <p className="text-xs text-muted-foreground">
                  Creates a placeholder ticket row in Supabase and pre-fills the form.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link href="/create">Go to create page</Link>
                </Button>
              </div>
            </div>
          </div>

          <FormTicketReply ticketId={selectedTicketId} />
        </CardContent>
      </Card>
    </section>
  );
}
