"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ticketReplySchema = z.object({
  ticketId: z.string().uuid("Provide a valid ticket UUID"),
  message: z.string().min(1, "Message is required"),
});

type TicketReplyValues = z.infer<typeof ticketReplySchema>;

type FormTicketReplyProps = {
  className?: string;
  ticketId?: string;
};

const wordCount = (value: string | undefined) => {
  if (!value) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
};

export function FormTicketReply({ className, ticketId }: FormTicketReplyProps) {
  const [response, setResponse] = useState<unknown | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<TicketReplyValues>({
    resolver: zodResolver(ticketReplySchema),
    defaultValues: {
      ticketId: "",
      message: "",
    },
  });

  useEffect(() => {
    if (ticketId) {
      form.setValue("ticketId", ticketId, { shouldDirty: true });
    }
  }, [ticketId, form]);

  const onSubmit = async (values: TicketReplyValues) => {
    setErrorMessage(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ticket/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.message ?? "Request failed");
      }
      setResponse(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error"
      );
    }
  };

  const responsePayload =
    response !== null && typeof response === "object" ? response : null;

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="ticketId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 4ee0b3e4-3cc4-4d04-9d36-8cfe2d75c0a5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Describe the issue the tenant reported..."
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground block text-right">
                  {wordCount(field.value)} {wordCount(field.value) === 1 ? "word" : "words"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer"
          >
            {form.formState.isSubmitting
              ? "Sending to Supabase..."
              : "Submit reply"}
          </Button>
        </form>
      </Form>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {responsePayload && (
        <pre className="max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs">
          {JSON.stringify(responsePayload, null, 2)}
        </pre>
      )}
    </div>
  );
}
