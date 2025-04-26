import { NumberTicker } from "@/components/magicui/number-ticker";

export function NumberTickerDemo() {
  return (
    <NumberTicker
      value={100}
      className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white"
    />
  );
}
