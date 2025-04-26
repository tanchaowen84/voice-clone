import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"

export default function InteractiveHoverButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <InteractiveHoverButton className="bg-blue-500 px-8 py-4 text-xl font-bold text-white">
        Hover Me
      </InteractiveHoverButton>
      
      <InteractiveHoverButton 
        className="bg-purple-500 px-8 py-4 text-xl font-bold text-white"
        onClick={() => alert("Clicked!")}
      >
        Interactive Button
      </InteractiveHoverButton>
    </div>
  )
} 