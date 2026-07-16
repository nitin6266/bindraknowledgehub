import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Forgot Password | Bindra Knowledge Hub ERP",
  description: "Reset your Bindra Knowledge Hub ERP password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Please contact your system administrator to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/login"
            className="text-body-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Back to sign in
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
