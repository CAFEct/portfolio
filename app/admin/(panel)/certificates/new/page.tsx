import Link from "next/link";
import CertificateForm from "@/components/admin/certificate-form";
import { createCertificate } from "../actions";

export default async function NewCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/certificates" className="text-sm text-white/60 hover:text-white">
        ← Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Novo certificado</h1>
      <div className="mt-6">
        <CertificateForm action={createCertificate} error={error} />
      </div>
    </div>
  );
}
