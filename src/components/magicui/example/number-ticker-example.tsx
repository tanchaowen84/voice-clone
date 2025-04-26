import { NumberTicker } from "@/components/magicui/number-ticker"

export default function NumberTickerExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <NumberTicker 
        className="text-6xl font-bold text-white"
        value={1234}
        direction="up"
      />
      
      <NumberTicker 
        className="text-4xl font-bold text-white"
        value={9876}
        direction="down"
        delay={0.5}
        decimalPlaces={2}
      />
    </div>
  )
} 