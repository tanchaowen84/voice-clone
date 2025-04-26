import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"

export default function AnimatedGradientTextExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <AnimatedGradientText className="text-6xl font-bold">
        Gradient Text
      </AnimatedGradientText>
      
      <AnimatedGradientText 
        className="text-4xl font-bold"
        colorFrom="#f59e0b"
        colorTo="#3b82f6"
        speed={2}
      >
        Custom Gradient
      </AnimatedGradientText>
    </div>
  )
} 