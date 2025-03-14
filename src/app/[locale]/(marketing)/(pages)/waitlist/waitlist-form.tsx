'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WaitlistForm({ labels }: { 
  labels: { 
    email: string; 
    subscribe: string; 
  } 
}) {
  return (
    <form action="" className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input type="email" id="email" required />
      </div>

      <Button type="submit" className="w-full">
        {labels.subscribe}
      </Button>
    </form>
  );
} 