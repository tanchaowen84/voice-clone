import { PulsatingButton } from "@/components/magicui/pulsating-button"

export default function PulsatingButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <PulsatingButton className="bg-blue-500 px-8 py-4 text-xl font-bold text-white">
        Pulsating Button
      </PulsatingButton>
      
      <PulsatingButton 
        className="bg-purple-500 px-8 py-4 text-xl font-bold text-white"
        onClick={() => alert("Clicked!")}
      >
        Click Me
      </PulsatingButton>
    </div>
  )
} 