import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

export default function AnimatedShinyTextExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <AnimatedShinyText className="text-6xl font-bold text-white">
        Shiny Text
      </AnimatedShinyText>
      
      <AnimatedShinyText 
        className="text-4xl font-bold text-white"
        shimmerWidth={200}
      >
        Wide Shine
      </AnimatedShinyText>
    </div>
  )
} 