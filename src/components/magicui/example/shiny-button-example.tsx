import { ShinyButton } from "@/components/magicui/shiny-button"

export default function ShinyButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <ShinyButton className="bg-blue-500 px-8 py-4 text-xl font-bold text-white">
        Shiny Button
      </ShinyButton>
      
      <ShinyButton 
        className="bg-purple-500 px-8 py-4 text-xl font-bold text-white"
        animate={{ "--x": "-200%" }}
        transition={{ duration: 2 }}
      >
        Custom Animation
      </ShinyButton>
    </div>
  )
} 