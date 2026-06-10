import { AuthPageShell } from "@/components/auth-page-shell";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <AuthPageShell mode="signin" searchParams={searchParams} />;
}
