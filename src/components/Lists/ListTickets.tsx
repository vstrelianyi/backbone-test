"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Ticket = {
  id: string;
  org_id: string | null;
  last_message: string | null;
  urgency: number | null;
  importance: number | null;
  sentiment: string | null;
  updated_at: string | null;
};

const formatTicketId = (id: string) =>
  id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

type ListTicketsProps = {
  onTicketSelect?: (ticketId: string) => void;
};

export function ListTickets({ onTicketSelect }: ListTicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadTickets() {
      setIsLoadingTickets(true);
      setTicketsError(null);

      try {
        const res = await fetch("/api/tickets", { signal: controller.signal });
        const data = await res.json();

        if (!res.ok) {
          if (!controller.signal.aborted && isMounted) {
            setTicketsError(data?.message ?? "Unable to load tickets");
            setTickets([]);
          }
          return;
        }

        if (!controller.signal.aborted && isMounted) {
          setTickets(Array.isArray(data?.tickets) ? data.tickets : []);
        }
      } catch (error) {
        if (!controller.signal.aborted && isMounted) {
          setTicketsError(
            error instanceof Error ? error.message : "Unexpected error"
          );
          setTickets([]);
        }
      } finally {
        if (!controller.signal.aborted && isMounted) {
          setIsLoadingTickets(false);
        }
      }
    }

    loadTickets();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [refreshIndex]);

  const ticketItems = useMemo(() => {
    if (!tickets?.length) {
      return [];
    }

    return tickets.map((ticket) => {
      const urgencyHigh = (ticket.urgency ?? 1) >= 3;
      const importanceHigh = (ticket.importance ?? 1) >= 2;
      const sentiment = ticket.sentiment ?? "neutral";
      const updatedAt = ticket.updated_at
        ? dateFormatter.format(new Date(ticket.updated_at))
        : "Unknown date";

      return {
        ...ticket,
        urgencyHigh,
        importanceHigh,
        sentiment,
        updatedAt,
      };
    });
  }, [tickets]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent tickets</CardTitle>
          <CardDescription>
            Pulled directly from Supabase (latest 25 updates).
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshIndex((prev) => prev + 1)}
          className="cursor-pointer"
          disabled={isLoadingTickets}
        >
          {isLoadingTickets ? "Refreshing..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingTickets ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse rounded-lg border bg-muted/40 p-4"
              >
                <div className="mb-2 h-4 w-1/4 rounded bg-foreground/20" />
                <div className="mb-1 h-3 w-1/2 rounded bg-foreground/10" />
                <div className="h-3 w-1/3 rounded bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : ticketsError ? (
          <p className="text-sm text-destructive">{ticketsError}</p>
        ) : ticketItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tickets found. Create one to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {ticketItems.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onTicketSelect?.(ticket.id)}
                className="rounded-lg border bg-card/50 p-4 shadow-xs transition hover:border-primary/40 cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      Ticket {formatTicketId(ticket.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Org {ticket.org_id ?? "—"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ticket.updatedAt}
                  </p>
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {ticket.last_message?.length
                    ? ticket.last_message
                    : "No messages yet – submit a reply to enrich this ticket."}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Badge
                    variant={ticket.urgencyHigh ? "destructive" : "secondary"}
                  >
                    {ticket.urgencyHigh ? "High urgency" : "Low urgency"}
                  </Badge>
                  <Badge
                    variant={ticket.importanceHigh ? "default" : "secondary"}
                  >
                    {ticket.importanceHigh
                      ? "High importance"
                      : "Normal importance"}
                  </Badge>
                  <Badge
                    variant={
                      ticket.sentiment === "negative"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    Sentiment: {ticket.sentiment}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

