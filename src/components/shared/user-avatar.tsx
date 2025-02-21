import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  name?: string;
  image?: string;
}

export function UserAvatar({ name, image, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {image ? (
        <AvatarImage
          alt={name || "user avatar"}
          title={name || "user avatar"}
          src={image}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{name}</span>
          <UserIcon className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
