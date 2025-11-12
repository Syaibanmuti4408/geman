"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";
import Link from "@/components/custom-link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const callbackURL = searchParams.get("next") || pathname;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL,
      });

      if (error) {
        setErrorMsg(error.message || "Login failed");
      }
    } catch (err) {
      setErrorMsg("Unexpected error, please try again.");
    } finally {
      // setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-full">
      <Card className="flex w-full max-w-sm justify-center">
        <CardHeader className="flex justify-center">
          <Logo size={100} />
        </CardHeader>
        <CardDescription className="text-center text-base">
          Enter email and password
        </CardDescription>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <div className="text-sm text-gray-600 self-center">
            No Geman account yet? Please{" "}
            <Link className="underline" href="/register">
              register
            </Link>{" "}
            first.
          </div>
        </CardFooter>
      </Card>
      <SocialLinks />
    </div>
  );
}
