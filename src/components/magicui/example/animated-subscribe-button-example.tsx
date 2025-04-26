import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button"

export default function AnimatedSubscribeButtonExample() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-10 bg-black/95 p-10">
      <AnimatedSubscribeButton 
        className="bg-blue-500 px-8 py-4 text-xl font-bold text-white"
        onClick={() => alert("Subscribed!")}
      >
        Subscribe Now
      </AnimatedSubscribeButton>
      
      <AnimatedSubscribeButton 
        className="bg-purple-500 px-8 py-4 text-xl font-bold text-white"
        onClick={() => alert("Joined!")}
      >
        Join Us
      </AnimatedSubscribeButton>
    </div>
  )
} 