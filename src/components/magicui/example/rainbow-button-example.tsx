import { RainbowButton } from "@/components/magicui/rainbow-button"

export default function RainbowButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <RainbowButton className="px-8 py-4 text-xl font-bold">
        Rainbow Button
      </RainbowButton>
      
      <RainbowButton 
        className="px-8 py-4 text-xl font-bold"
      >
        Another Rainbow
      </RainbowButton>
    </div>
  )
} 