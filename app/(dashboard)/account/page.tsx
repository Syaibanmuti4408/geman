import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { getServerSession } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession();

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-8">
          {/* Email Address */}
          <div className="flex justify-between items-center">
            <span>Email Address</span>
            <span>{session?.user.email}</span>
          </div>

          {/* Username */}
          <div className="flex justify-between items-center">
            <span>Username</span>
            <span>{session?.user.name}</span>
          </div>

          {/* Avatar */}
          <div className="flex justify-between items-center">
            <span>Avatar</span>
            <div className="flex items-center space-x-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-black text-white font-bold text-2xl">
                {session?.user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="flex justify-between items-center">
            <span>Change Password</span>
            <Button variant="outline">Change</Button>
          </div>

          {/* Delete Account */}
          <div className="flex justify-between items-center">
            <span className="text-red-600 font-medium">Delete Account</span>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
