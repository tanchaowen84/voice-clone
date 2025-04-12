import { DeleteAccountCard } from '@/components/settings/security/delete-account-card';
import { PasswordCardWrapper } from '@/components/settings/security/password-card-wrapper';

export default function SecurityPage() {
  return (
    <div className="grid gap-8 grid-cols-1">
      <PasswordCardWrapper />
      <DeleteAccountCard />
    </div>
  );
}
