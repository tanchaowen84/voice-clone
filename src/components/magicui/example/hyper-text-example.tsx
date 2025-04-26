import { HyperText } from "@/components/magicui/hyper-text"

export default function HyperTextExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <HyperText
        className="text-4xl font-bold text-white"
        duration={800}
        animateOnHover={true}
      >
        Hover over me
      </HyperText>
      <HyperText
        className="text-4xl font-bold text-white"
        duration={1200}
        delay={200}
        animateOnHover={true}
      >
        Another example
      </HyperText>
    </div>
  )
} 