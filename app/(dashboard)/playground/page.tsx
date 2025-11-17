"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Format = "openai" | "gemini";

type OpenAIChatCompletion = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: "assistant"; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export default function PlaygroundPage() {
  const [format, setFormat] = useState<Format>("openai");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [token, setToken] = useState("");
  const [system, setSystem] = useState("");
  const [prompt, setPrompt] = useState("Say hello from the proxy.");
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [proxyStatus, setProxyStatus] = useState<string>("unknown");

  async function pingProxy() {
    setProxyStatus("checking...");
    try {
      const res = await fetch(
        `/v1beta/models/${model}:generateContent`,
        { method: "GET" },
      );
      const data = await res.json();
      setProxyStatus(`${data.status || "unknown"} (${res.status})`);
    } catch {
      setProxyStatus("error");
    }
  }

  function buildPayload(fmt: Format, sys: string, text: string) {
    if (fmt === "openai") {
      // OpenAI chat-completion style body (converted by proxy)
      return {
        model: "gpt-4o-mini",
        messages: [
          ...(sys.trim() ? [{ role: "system", content: sys.trim() }] : []),
          { role: "user", content: text },
        ],
        temperature: 0.7,
        max_tokens: 256,
      };
    }
    // Gemini native style body
    const mergedText = sys.trim() ? `System: ${sys.trim()}\n\n${text}` : text;
    return {
      contents: [
        {
          role: "user",
          parts: [{ text: mergedText }],
        },
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
    };
  }

  async function sendTest() {
    setLoading(true);
    setError(null);
    setResult(null);
    setStatusCode(null);

    try {
      const body = buildPayload(format, system, prompt);
      const res = await fetch(
        `/v1beta/models/${model}:generateContent?key=${process.env.NEXT_PUBLIC_ALLOWED_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      setStatusCode(res.status);

      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data?.error === "string" ? data.error : "Request failed",
        );
        setResult(data);
        return;
      }

      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  const assistantText =
    format === "openai"
      ? (result as OpenAIChatCompletion | null)?.choices?.[0]?.message
        ?.content || ""
      : result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const usageText =
    format === "openai"
      ? (() => {
        const usage = (result as OpenAIChatCompletion | null)?.usage;
        if (!usage) return "";
        return `Tokens: prompt=${usage.prompt_tokens}, completion=${usage.completion_tokens}, total=${usage.total_tokens}`;
      })()
      : (() => {
        const u = result?.usageMetadata;
        if (!u) return "";
        return `Tokens: prompt=${u.promptTokenCount || 0}, completion=${u.candidatesTokenCount || 0}, total=${u.totalTokenCount || 0}`;
      })();

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Proxy Playground</h1>
        <p className="text-muted-foreground text-sm">
          Send a test request through the Gemini/OpenAI proxy and inspect the
          result.
        </p>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Format</Label>
            <div className="flex gap-2">
              <Button
                variant={format === "openai" ? "default" : "outline"}
                onClick={() => setFormat("openai")}
              >
                OpenAI Chat
              </Button>
              <Button
                variant={format === "gemini" ? "default" : "outline"}
                onClick={() => setFormat("gemini")}
              >
                Gemini
              </Button>
            </div>
            <div className="ml-auto">
              <Button variant="outline" onClick={pingProxy}>
                Ping Proxy
              </Button>
              <span className="ml-2 text-sm text-slate-500">
                Status: {proxyStatus}
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              placeholder="gemini-2.0-flash"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="token">Access Token</Label>
            <Input
              id="token"
              placeholder="Query param 'key' (optional)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="system">System (optional)</Label>
            <Input
              id="system"
              placeholder="High-level instruction to guide the assistant"
              value={system}
              onChange={(e) => setSystem(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="prompt">Prompt</Label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Type your message to test the proxy..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={sendTest} disabled={loading || !prompt.trim()}>
              {loading ? "Sending..." : "Send Test Request"}
            </Button>
            {statusCode !== null && (
              <span className="text-sm text-slate-600">HTTP {statusCode}</span>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Error: {error}
            </div>
          )}

          {assistantText && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-sm font-medium text-slate-700">
                Assistant Reply
              </div>
              <div className="whitespace-pre-wrap text-sm text-slate-900">
                {assistantText}
              </div>
              {usageText && (
                <div className="mt-2 text-xs text-slate-600">{usageText}</div>
              )}
            </div>
          )}

          {result && (
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-1 text-sm font-medium text-slate-700">
                Raw JSON
              </div>
              <pre className="max-h-96 overflow-auto text-xs text-slate-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-slate-500">
            If you see “No available API keys”, go to Keys page and add or
            activate keys.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
