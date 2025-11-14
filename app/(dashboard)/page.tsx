import { redirect } from "next/navigation";
// import { getSession } from "@/app/actions/auth";
import KeyCallsPanel from "@/components/key-calls-panel";

export default async function Home() {
  // const session = await getSession();

  // if (!session) {
  //   redirect("/login");
  // }

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to your dashboard. You can configure the Gemini API Key proxy
          and load balancing.
        </p>
      </div>
      {/* API Key Call Monitoring Panel */}
      <KeyCallsPanel />
    </div>
  );
}
