import { RippleButton } from "@/components/magicui/ripple-button"

export default function RippleButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <RippleButton className="bg-blue-500 px-8 py-4 text-xl font-bold text-white">
        Click Me
      </RippleButton>
      
      <RippleButton 
        className="bg-purple-500 px-8 py-4 text-xl font-bold text-white"
        rippleColor="rgba(255, 255, 255, 0.4)"
      >
        Custom Ripple
      </RippleButton>
    </div>
  )
} 