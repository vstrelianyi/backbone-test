"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const createSchema = z.object({
  orgId: z
    .string()
    .uuid("Provide a valid UUID")
    .optional()
    .or(z.literal("")),
});

type CreateTicketValues = z.infer<typeof createSchema>;

type FormCreateTicketProps = {
  onSuccess?: (payload: unknown) => void;
};

export function FormCreateTicket({ onSuccess }: FormCreateTicketProps) {
  const [result, setResult] = useState<unknown | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      orgId: "",
    },
  });

  const onSubmit = async (values: CreateTicketValues) => {
    setResult(null);
    setErrorMessage(null);

    const payload =
      values.orgId && values.orgId.length > 0 ? { orgId: values.orgId } : {};

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.message ?? "Unable to create ticket");
        return;
      }

      setResult(data);
      onSuccess?.(data);
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error"
      );
    }
  };

  const responsePayload =
    result !== null && typeof result === "object" ? result : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="orgId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Org ID (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Leave blank to auto-generate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
        >
          {form.formState.isSubmitting ? "Creating ticket..." : "Create ticket"}
        </Button>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        {responsePayload && (
          <pre className="max-h-80 overflow-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(responsePayload, null, 2)}
          </pre>
        )}
      </form>
    </Form>
  );
}
