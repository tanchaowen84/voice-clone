import { SparklesText } from "@/components/magicui/sparkles-text"

export default function SparklesTextExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <SparklesText className="text-4xl font-bold text-white">
        ✨ Sparkly Text ✨
      </SparklesText>
      
      <SparklesText 
        className="text-3xl font-bold text-white"
        colors={{ first: "#FFA07A", second: "#87CEEB" }}
        sparklesCount={15}
      >
        Custom Sparkles
      </SparklesText>
    </div>
  )
} 