"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { isDemoAuthEnabled } from "@/lib/auth-config";
import { signInDemoUser } from "@/lib/demo-auth";
import { useAuthSession } from "@/components/auth-session-provider";
import { useLanguage } from "@/components/language-provider";

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

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const fieldClassName =
  "w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-[0.98rem] font-normal text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10";
const fieldErrorClassName = "border-red-400/60 bg-red-500/5 focus:border-red-400";
const requiredMark = <span className="ml-1 text-sky-300">*</span>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]*$/;
const maxLengths = {
  fullName: 80,
  email: 254,
  phone: 32,
  password: 128,
} as const;
const allowedSignupReasons = new Set<SignupReason>(["saas", "custom", "both", "exploring"]);
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
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
  const { t } = useLanguage();
  const a = t.auth;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupReason, setSignupReason] = useState<SignupReason>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string>(initialMessage || "");
  const [formError, setFormError] = useState<string>(initialError || "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const signupRedirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSignup = mode === "signup";

  // Derived password strength
  function getPasswordStrengthMessage(pw: string) {
    if (!pw) return "";
    if (pw.length < 8) return a.passwordStrength.tooShort;
    if (!/[A-Z]/.test(pw)) return a.passwordStrength.noUppercase;
    if (!/[a-z]/.test(pw)) return a.passwordStrength.noLowercase;
    if (!/\d/.test(pw)) return a.passwordStrength.noNumber;
    return a.passwordStrength.strong;
  }
  function isStrongPassword(pw: string) {
    return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);
  }

  const passwordStrengthMessage = isSignup ? getPasswordStrengthMessage(password) : "";
  const passwordsMatch = !isSignup || !confirmPassword || password === confirmPassword;

  function getFriendlyAuthError(message: string) {
    const normalized = message.toLowerCase();
    if (normalized.includes("invalid login credentials")) return a.errors.invalidCredentials;
    if (normalized.includes("password should be at least")) return a.errors.passwordTooShort;
    if (normalized.includes("user already registered")) return a.errors.alreadyRegistered;
    if (normalized.includes("unable to validate email address") || normalized.includes("invalid email")) return a.errors.invalidEmail;
    return message;
  }

  function validateAuthForm() {
    const errors: FieldErrors = {};
    const normalizedFullName = normalizeWhitespace(fullName);
    const normalizedEmail = email.trim().toLowerCase();

    if (isSignup && !normalizedFullName) errors.fullName = a.errors.fullNameRequired;
    else if (isSignup && normalizedFullName.length > maxLengths.fullName) errors.fullName = a.errors.fullNameTooLong;

    if (!normalizedEmail) errors.email = a.errors.emailRequired;
    else if (normalizedEmail.length > maxLengths.email) errors.email = a.errors.emailTooLong;
    else if (!emailPattern.test(normalizedEmail)) errors.email = a.errors.invalidEmail;

    if (isSignup && !signupReason) errors.signupReason = a.errors.signupReasonRequired;
    else if (isSignup && !allowedSignupReasons.has(signupReason)) errors.signupReason = a.errors.signupReasonInvalid;

    if (isSignup && phone.trim()) {
      const normalizedPhone = normalizeWhitespace(phone);
      if (normalizedPhone.length > maxLengths.phone) errors.phone = a.errors.phoneTooLong;
      else if (!phonePattern.test(normalizedPhone)) errors.phone = a.errors.phoneInvalid;
    }

    if (!password.trim()) errors.password = a.errors.passwordRequired;
    else if (password.length > maxLengths.password) errors.password = a.errors.passwordTooLongField;
    else if (isSignup && !isStrongPassword(password)) errors.password = a.errors.passwordWeak;

    if (isSignup && !confirmPassword.trim()) errors.confirmPassword = a.errors.confirmRequired;
    else if (isSignup && password !== confirmPassword) errors.confirmPassword = a.errors.passwordsMismatch;

    return errors;
  }

  useEffect(() => {
    if (user && mode === "signin") router.replace(nextPath);
  }, [mode, nextPath, router, user]);

  useEffect(() => {
    return () => {
      if (signupRedirectTimerRef.current) clearTimeout(signupRedirectTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    const siteKey = turnstileSiteKey;
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    function renderTurnstile() {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile || turnstileWidgetIdRef.current) return;
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        appearance: "interaction-only",
        callback: (token) => {
          setTurnstileToken(token);
          setFormError((current) => (current === a.errors.turnstileRequired ? "" : current));
        },
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    if (!document.getElementById("cloudflare-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.head.appendChild(script);
    }
    renderTurnstile();
    if (!window.turnstile) pollTimer = setInterval(renderTurnstile, 250);

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) window.turnstile.remove(turnstileWidgetIdRef.current);
      turnstileWidgetIdRef.current = null;
      setTurnstileToken("");
    };
  }, [isSignup, a.errors.turnstileRequired]);

  function resetTurnstile() {
    setTurnstileToken("");
    if (turnstileWidgetIdRef.current) window.turnstile?.reset(turnstileWidgetIdRef.current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setStatus("");

    const errors = validateAuthForm();
    setFieldErrors(errors);

    if (mode === "signin") {
      if (errors.email || errors.password) return;
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
      setFormError(a.errors.supabaseNotConfigured);
      return;
    }

    setIsSubmitting(true);

    if (mode === "signup") {
      if (turnstileSiteKey && !turnstileToken) {
        setFormError(a.errors.turnstileRequired);
        setIsSubmitting(false);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedFullName = normalizeWhitespace(fullName);
      const normalizedPhone = normalizeWhitespace(phone);

      const { error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          captchaToken: turnstileToken || undefined,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          data: {
            full_name: normalizedFullName,
            phone: normalizedPhone || undefined,
            signup_reason: signupReason,
          },
        },
      });

      if (signUpError) {
        const friendly = getFriendlyAuthError(signUpError.message);
        setFormError(friendly);
        resetTurnstile();
        if (friendly.includes("email") || friendly.includes("邮箱")) {
          setFieldErrors((current) => ({ ...current, email: friendly }));
        }
        setIsSubmitting(false);
        return;
      }

      const successMessage = a.success.signupMessage.replace("{email}", normalizedEmail);
      setStatus(`${successMessage} ${a.success.signupRedirect}`);
      setPassword("");
      setConfirmPassword("");
      resetTurnstile();
      setIsSubmitting(false);

      if (signupRedirectTimerRef.current) clearTimeout(signupRedirectTimerRef.current);
      signupRedirectTimerRef.current = setTimeout(() => {
        router.replace(`/signin?message=${encodeURIComponent(successMessage)}&next=${encodeURIComponent(nextPath)}`);
      }, 900);
      return;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
      options: { captchaToken: turnstileToken || undefined },
    });

    if (signInError) {
      const friendly = getFriendlyAuthError(signInError.message);
      setFormError(friendly);
      setFieldErrors({
        email: (friendly.includes("email") || friendly.includes("邮箱")) ? friendly : undefined,
        password: (friendly.includes("password") || friendly.includes("incorrect") || friendly.includes("不正确")) ? friendly : undefined,
      });
      resetTurnstile();
      setIsSubmitting(false);
      return;
    }

    const signedInUser = signInData.user;
    const isEmailConfirmed = Boolean(signedInUser?.email_confirmed_at || signedInUser?.confirmed_at);
    if (signedInUser && !isEmailConfirmed) {
      await supabase.auth.signOut();
      setFormError(a.errors.emailNotConfirmed);
      setIsSubmitting(false);
      return;
    }

    router.replace(nextPath);
    setIsSubmitting(false);
  }

  const signupReasonOptions = [
    { value: "saas", label: a.signupReasons.products },
    { value: "custom", label: a.signupReasons.custom },
    { value: "both", label: a.signupReasons.both },
    { value: "exploring", label: a.signupReasons.exploring },
  ];

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
      <h1 className="font-heading text-3xl font-bold text-white md:text-[2.1rem]">
        {isSignup ? a.signUp.title : a.signIn.title}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
        {isSignup ? a.signUp.subtitle : a.signIn.subtitle}
      </p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                {a.fields.fullName}{requiredMark}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (fieldErrors.fullName) setFieldErrors((c) => ({ ...c, fullName: undefined })); }}
                placeholder={a.fields.fullNamePlaceholder}
                className={inputClass(Boolean(fieldErrors.fullName))}
                autoComplete="name"
                maxLength={maxLengths.fullName}
                required
                aria-invalid={Boolean(fieldErrors.fullName)}
              />
              <FieldError message={fieldErrors.fullName} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                {a.fields.email}{requiredMark}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((c) => ({ ...c, email: undefined })); }}
                placeholder={a.fields.emailPlaceholder}
                className={inputClass(Boolean(fieldErrors.email))}
                autoComplete="email"
                maxLength={maxLengths.email}
                required
                aria-invalid={Boolean(fieldErrors.email)}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                {a.fields.phone} <span className="text-xs font-normal text-slate-500">{a.fields.phoneOptional}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (fieldErrors.phone) setFieldErrors((c) => ({ ...c, phone: undefined })); }}
                placeholder={a.fields.phonePlaceholder}
                className={inputClass(Boolean(fieldErrors.phone))}
                autoComplete="tel"
                maxLength={maxLengths.phone}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              <FieldError message={fieldErrors.phone} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                {a.fields.password}{requiredMark}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((c) => ({ ...c, password: undefined })); }}
                placeholder={a.fields.passwordNewPlaceholder}
                className={inputClass(Boolean(fieldErrors.password))}
                autoComplete="new-password"
                maxLength={maxLengths.password}
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
                {a.fields.confirmPassword}{requiredMark}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) setFieldErrors((c) => ({ ...c, confirmPassword: undefined })); }}
                placeholder={a.fields.confirmPasswordPlaceholder}
                className={inputClass(Boolean(fieldErrors.confirmPassword))}
                autoComplete="new-password"
                maxLength={maxLengths.password}
                required
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
              />
              <FieldError message={fieldErrors.confirmPassword} />
              {confirmPassword ? (
                <p className={`mt-2 text-xs ${passwordsMatch ? "text-emerald-300" : "text-red-300"}`}>
                  {passwordsMatch ? a.passwordStrength.match : a.passwordStrength.noMatch}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-normal text-slate-300">
                {a.fields.signupReason}{requiredMark}
              </label>
              <div className="relative">
                <select
                  value={signupReason}
                  onChange={(e) => { setSignupReason(e.target.value as SignupReason); if (fieldErrors.signupReason) setFieldErrors((c) => ({ ...c, signupReason: undefined })); }}
                  className={`${inputClass(Boolean(fieldErrors.signupReason))} appearance-none pr-11`}
                  required
                  aria-invalid={Boolean(fieldErrors.signupReason)}
                >
                  <option value="" className="bg-slate-950 text-slate-400">{a.fields.signupReasonPlaceholder}</option>
                  {signupReasonOptions.map((r) => (
                    <option key={r.value} value={r.value} className="bg-slate-950 text-slate-200">{r.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">▾</span>
              </div>
              <FieldError message={fieldErrors.signupReason} />
            </div>

            {turnstileSiteKey ? (
              <div>
                <div ref={turnstileContainerRef} />
                <p className="text-xs leading-5 text-slate-600">{a.turnstile}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">{a.fields.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((c) => ({ ...c, email: undefined })); }}
                placeholder={a.fields.emailPlaceholder}
                className={inputClass(Boolean(fieldErrors.email))}
                autoComplete="email"
                maxLength={maxLengths.email}
                required
                aria-invalid={Boolean(fieldErrors.email)}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">{a.fields.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((c) => ({ ...c, password: undefined })); }}
                placeholder={a.fields.passwordPlaceholder}
                className={inputClass(Boolean(fieldErrors.password))}
                autoComplete="current-password"
                maxLength={maxLengths.password}
                required
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <FieldError message={fieldErrors.password} />
            </div>

            {turnstileSiteKey ? (
              <div>
                <div ref={turnstileContainerRef} />
                <p className="text-xs leading-5 text-slate-600">{a.turnstile}</p>
              </div>
            ) : null}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? (isSignup ? a.signUp.buttonBusy : a.signIn.buttonBusy)
            : (isSignup ? a.signUp.button : a.signIn.button)}
        </button>
      </form>

      {status ? <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{status}</p> : null}
      {formError ? <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{formError}</p> : null}
      {!formError && authNotice ? <p className="mt-4 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">{authNotice}</p> : null}

      <div className="mt-6 text-sm text-slate-400">
        {isSignup ? (
          <p>
            {a.signUp.hasAccount}{" "}
            <Link href={`/signin?next=${encodeURIComponent(nextPath)}`} className="font-bold text-cyan-200 underline decoration-cyan-200 underline-offset-4 transition hover:text-white hover:decoration-white">
              {a.signUp.signInLink}
            </Link>
            .
          </p>
        ) : (
          <p>
            {a.signIn.noAccount}{" "}
            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="font-bold text-cyan-200 underline decoration-cyan-200 underline-offset-4 transition hover:text-white hover:decoration-white">
              {a.signIn.createLink}
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
