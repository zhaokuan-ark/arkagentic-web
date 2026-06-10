"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { isDemoAuthEnabled } from "@/lib/auth-config";
import { signInDemoUser } from "@/lib/demo-auth";
import { useAuthSession } from "@/components/auth-session-provider";

type AuthMode = "signin" | "signup";
type SignupReason = "saas" | "custom" | "both" | "exploring" | "";
type FieldErrors = Partial<
  Record<"fullName" | "email" | "signupReason" | "phone" | "password" | "confirmPassword" | "form", string>
>;

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
  initialError?: string;
  initialMessage?: string;
};

const signupReasons = [
  { value: "saas", label: "Use ArkAgentic products" },
  { value: "custom", label: "Discuss a custom AI system" },
  { value: "both", label: "Both products and custom work" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

const fieldClassName =
  "w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-[0.98rem] font-normal text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10";
const fieldErrorClassName = "border-red-400/60 bg-red-500/5 focus:border-red-400";
const requiredMark = <span className="ml-1 text-sky-300">*</span>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email or password looks incorrect.";
  }

  if (normalized.includes("password should be at least")) {
    return "Your password is too short. Please use at least 8 characters.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (normalized.includes("unable to validate email address") || normalized.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  return message;
}

function getPasswordStrengthMessage(password: string) {
  if (!password) return "";
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
  if (!/\d/.test(password)) return "Add at least one number.";
  return "Strong password.";
}

function isStrongPassword(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

function validateAuthForm(input: {
  mode: AuthMode;
  fullName: string;
  email: string;
  signupReason: SignupReason;
  password: string;
  confirmPassword: string;
}) {
  const errors: FieldErrors = {};
  const isSignup = input.mode === "signup";

  if (isSignup && !input.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  }

  if (!input.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!emailPattern.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (isSignup && !input.signupReason) {
    errors.signupReason = "Please select what brings you to ArkAgentic.";
  }

  if (!input.password.trim()) {
    errors.password = "Please enter your password.";
  } else if (isSignup && !isStrongPassword(input.password)) {
    errors.password = "Use at least 8 characters, one uppercase letter, one lowercase letter, and one number.";
  }

  if (isSignup && !input.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (isSignup && input.password !== input.confirmPassword) {
    errors.confirmPassword = "Your passwords do not match.";
  }

  return errors;
}

function inputClass(hasError: boolean) {
  return `${fieldClassName} ${hasError ? fieldErrorClassName : ""}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-red-300">{message}</p>;
}

export function AuthForm({ mode, nextPath = "/apps", initialError, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const { user, authNotice } = useAuthSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupReason, setSignupReason] = useState<SignupReason>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string>(initialMessage || "");
  const [formError, setFormError] = useState<string>(initialError || "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signupRedirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSignup = mode === "signup";
  const title = isSignup ? "Create account" : "Sign in";
  const helper = isSignup
    ? "Set up your ArkAgentic account and tell us what you want help with."
    : "Sign in to your ArkAgentic account.";
  const buttonLabel = isSignup ? "Create account" : "Sign in";
  const passwordStrengthMessage = isSignup ? getPasswordStrengthMessage(password) : "";
  const passwordsMatch = !isSignup || !confirmPassword || password === confirmPassword;

  useEffect(() => {
    if (user && mode === "signin") {
      router.replace(nextPath);
    }
  }, [mode, nextPath, router, user]);

  useEffect(() => {
    return () => {
      if (signupRedirectTimerRef.current) {
        clearTimeout(signupRedirectTimerRef.current);
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setStatus("");

    const errors = validateAuthForm({
      mode,
      fullName,
      email,
      signupReason,
      password,
      confirmPassword,
    });

    setFieldErrors(errors);

    if (mode === "signin") {
      if (errors.email || errors.password) {
        return;
      }
    } else if (Object.keys(errors).length > 0) {
      return;
    }

    if (!supabase) {
      if (isDemoAuthEnabled()) {
        signInDemoUser(email);
        setStatus(mode === "signup" ? "Demo account created locally. Redirecting..." : "Demo sign-in complete. Redirecting...");
        router.replace(nextPath);
        return;
      }

      setFormError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin?message=${encodeURIComponent("Your email has been confirmed. Please sign in.")}&next=${encodeURIComponent(nextPath)}`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            signup_reason: signupReason,
          },
        },
      });

      if (signUpError) {
        const friendly = getFriendlyAuthError(signUpError.message);
        setFormError(friendly);

        if (friendly.includes("email")) {
          setFieldErrors((current) => ({ ...current, email: friendly }));
        }

        setIsSubmitting(false);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const successMessage = `Your account has been created. Please check ${normalizedEmail} and click the confirmation link in your email before signing in.`;

      setStatus(`${successMessage} Redirecting you to sign in...`);
      setPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);

      if (signupRedirectTimerRef.current) {
        clearTimeout(signupRedirectTimerRef.current);
      }

      signupRedirectTimerRef.current = setTimeout(() => {
        router.replace(`/signin?message=${encodeURIComponent(successMessage)}&next=${encodeURIComponent(nextPath)}`);
      }, 900);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      const friendly = getFriendlyAuthError(signInError.message);
      setFormError(friendly);
      setFieldErrors({
        email: friendly.includes("email") ? friendly : undefined,
        password: friendly.includes("password") || friendly.includes("incorrect") ? friendly : undefined,
      });
      setIsSubmitting(false);
      return;
    }

    router.replace(nextPath);
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
      <h1 className="font-heading text-3xl font-bold text-white md:text-[2.1rem]">{title}</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">{helper}</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                Full Name
                {requiredMark}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (fieldErrors.fullName) {
                    setFieldErrors((current) => ({ ...current, fullName: undefined }));
                  }
                }}
                placeholder="Your full name"
                className={inputClass(Boolean(fieldErrors.fullName))}
                required
                aria-invalid={Boolean(fieldErrors.fullName)}
              />
              <FieldError message={fieldErrors.fullName} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                Email
                {requiredMark}
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }
                }}
                placeholder="name@company.com"
                className={inputClass(Boolean(fieldErrors.email))}
                required
                aria-invalid={Boolean(fieldErrors.email)}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                Phone number <span className="text-xs font-normal text-slate-500">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0400 000 000"
                className={inputClass(Boolean(fieldErrors.phone))}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              <FieldError message={fieldErrors.phone} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                Password
                {requiredMark}
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }
                }}
                placeholder="Create a password"
                className={inputClass(Boolean(fieldErrors.password))}
                required
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <FieldError message={fieldErrors.password} />
              {passwordStrengthMessage ? (
                <p className={`mt-2 text-xs ${isStrongPassword(password) ? "text-emerald-300" : "text-amber-300"}`}>
                  {passwordStrengthMessage}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                Confirm password
                {requiredMark}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
                  }
                }}
                placeholder="Enter your password again"
                className={inputClass(Boolean(fieldErrors.confirmPassword))}
                required
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
              />
              <FieldError message={fieldErrors.confirmPassword} />
              {confirmPassword ? (
                <p className={`mt-2 text-xs ${passwordsMatch ? "text-emerald-300" : "text-red-300"}`}>
                  {passwordsMatch ? "Passwords match." : "Passwords do not match yet."}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                What brings you to ArkAgentic?
                {requiredMark}
              </label>
              <div className="relative">
                <select
                  value={signupReason}
                  onChange={(event) => {
                    setSignupReason(event.target.value as SignupReason);
                    if (fieldErrors.signupReason) {
                      setFieldErrors((current) => ({ ...current, signupReason: undefined }));
                    }
                  }}
                  className={`${inputClass(Boolean(fieldErrors.signupReason))} appearance-none pr-11`}
                  required
                  aria-invalid={Boolean(fieldErrors.signupReason)}
                >
                  <option value="" className="bg-slate-950 text-slate-400">
                    Select one option
                  </option>
                  {signupReasons.map((reason) => (
                    <option key={reason.value} value={reason.value} className="bg-slate-950 text-slate-200">
                      {reason.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">▾</span>
              </div>
              <FieldError message={fieldErrors.signupReason} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }
                }}
                placeholder="name@company.com"
                className={inputClass(Boolean(fieldErrors.email))}
                required
                aria-invalid={Boolean(fieldErrors.email)}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }
                }}
                placeholder="Enter your password"
                className={inputClass(Boolean(fieldErrors.password))}
                required
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <FieldError message={fieldErrors.password} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (isSignup ? "Creating account..." : "Signing in...") : buttonLabel}
        </button>
      </form>

      {status ? <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{status}</p> : null}
      {formError ? <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{formError}</p> : null}
      {!formError && authNotice ? <p className="mt-4 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">{authNotice}</p> : null}

      <div className="mt-6 text-sm text-slate-400">
        {isSignup ? (
          <p>
            Already have an account?{" "}
            <Link
              href={`/signin?next=${encodeURIComponent(nextPath)}`}
              className="font-bold text-cyan-200 underline decoration-cyan-200 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Sign in here
            </Link>
            .
          </p>
        ) : (
          <p>
            Need a new account?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextPath)}`}
              className="font-bold text-cyan-200 underline decoration-cyan-200 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Create one here
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
