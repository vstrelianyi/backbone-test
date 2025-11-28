"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormCreateTicket } from "@/components/Forms/FormCreateTicket";

export default function PageCreateTicket() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create ticket</CardTitle>
          <CardDescription>
            Generates a placeholder ticket row in Supabase so you can test reply
            enrichment flows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormCreateTicket />
        </CardContent>
      </Card>
    </section>
  );
}
