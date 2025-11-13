"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "@/components/custom-link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const callbackURL = searchParams.get("next") || pathname;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Sign up request
      const { error } = await authClient.signUp.email({
        name: "admin",
        email,
        password,
        callbackURL,
      });

      if (error) {
        setErrorMsg(error.message || "Registration failed");
      } else {
        // setSuccessMsg("Account created successfully! Redirecting...");
        router.push(callbackURL);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unexpected error, please try again.");
    } finally {
      // setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm items-center justify-center h-full">
      <Card className="w-full">
        <CardHeader className="flex justify-center">
          <Logo size={100} />
        </CardHeader>
        <CardDescription className="text-center text-base">
          Create the first admin account
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
                minLength={8}
                maxLength={128}
                placeholder="Enter password"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-sm text-green-600 text-center">{successMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <div className="text-sm text-gray-600 self-center">
            Already have a Geman account? Please{" "}
            <Link className="underline" href="/login">
              login
            </Link>{" "}
            .
          </div>
        </CardFooter>
      </Card>
      <SocialLinks />
    </div>
  );
}
