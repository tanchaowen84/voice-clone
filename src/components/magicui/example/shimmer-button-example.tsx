import { ShimmerButton } from "@/components/magicui/shimmer-button"

export default function ShimmerButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <ShimmerButton className="px-8 py-4 text-xl font-bold">
        Shimmer Button
      </ShimmerButton>
      
      <ShimmerButton 
        className="px-8 py-4 text-xl font-bold"
        shimmerColor="rgba(255, 255, 255, 0.2)"
        shimmerSize="lg"
      >
        Custom Shimmer
      </ShimmerButton>
    </div>
  )
} 