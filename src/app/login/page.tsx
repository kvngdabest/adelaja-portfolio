import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/login-form";
import { GatewayFlow } from "@/components/ui/gateway-flow";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="absolute inset-0">
        <GatewayFlow />
      </div>
      <div className="glass glow-cerulean relative z-10 w-full max-w-sm rounded-2xl p-8">
        <div className="mb-8 flex flex-col gap-1 text-center">
          <span className="font-heading text-lg font-semibold" aria-hidden="true">
            Adelaja<span className="text-cerulean">.</span>
          </span>
          <h1 className="font-sans text-sm font-normal text-muted-foreground">
            Sign in to manage the site
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
