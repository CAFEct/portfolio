import Link from "next/link";
import { notFound } from "next/navigation";
import CertificateForm from "@/components/admin/certificate-form";
import { getCertificateById } from "@/lib/queries";
import { updateCertificate } from "../../actions";

export default async function EditCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const certificate = await getCertificateById(id);
  if (!certificate) notFound();

  return (
    <div>
      <Link href="/admin/certificates" className="text-sm text-white/60 hover:text-white">
        ← Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar certificado</h1>
      <div className="mt-6">
        <CertificateForm
          action={updateCertificate.bind(null, certificate.id)}
          certificate={certificate}
          error={error}
        />
      </div>
    </div>
  );
}
