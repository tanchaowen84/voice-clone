import { ClientTweetCard } from "@/components/magicui/twitter-card-client";

interface TweetCardDemoProps {
  id: string;
}

export function TweetCardDemo({ id }: TweetCardDemoProps) {
  return <ClientTweetCard id={id} className="shadow-2xl" />;
}
