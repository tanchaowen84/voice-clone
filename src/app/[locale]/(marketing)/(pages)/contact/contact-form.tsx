'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm({ labels }: { 
  labels: { 
    name: string; 
    email: string; 
    message: string; 
    submit: string; 
  } 
}) {
  return (
    <form action="" className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{labels.name}</Label>
        <Input type="text" id="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input type="email" id="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="msg">{labels.message}</Label>
        <Textarea id="msg" rows={3} />
      </div>

      <Button type="submit" className="w-full">
        {labels.submit}
      </Button>
    </form>
  );
} 