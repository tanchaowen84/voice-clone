import { AuthCard } from "@/components/auth/auth-card";
import { TriangleAlertIcon } from "lucide-react";

export const ErrorCard = () => {
  return (
    <AuthCard
      headerLabel="Something went wrong!"
      bottomButtonHref="/auth/login"
      bottomButtonLabel="Back to login"
      className="border-none"
    >
      <div className="w-full flex justify-center items-center py-4 gap-2">
        <TriangleAlertIcon className="text-destructive size-4" />
        <p className="font-medium text-destructive">Please try again.</p>
      </div>
    </AuthCard>
  );
};
