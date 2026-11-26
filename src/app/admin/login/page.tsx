import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialNotAdmin = params.error === "not_admin";

  return <AdminLoginForm initialNotAdmin={initialNotAdmin} />;
}
