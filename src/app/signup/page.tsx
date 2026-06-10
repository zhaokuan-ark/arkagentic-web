import { AuthPageShell } from "@/components/auth-page-shell";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <AuthPageShell mode="signup" searchParams={searchParams} />;
}
