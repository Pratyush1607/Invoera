import { notFound } from "next/navigation";
import { NewInvoiceForm } from "@/components/clients/NewInvoiceForm";
import { getClientById } from "@/lib/data/clients";

export default async function NewInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  return <NewInvoiceForm clientId={client.id} clientName={client.name} />;
}
