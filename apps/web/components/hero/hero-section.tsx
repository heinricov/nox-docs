import { ArrowUpRight, CirclePlay } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import AnimatedGridPattern from "./animated-grid-pattern"

export function Hero() {
  return (
    <div className="relative flex max-h-svh items-center justify-center overflow-hidden px-6 py-20 sm:py-24 lg:py-32">
      <AnimatedGridPattern
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
        duration={3}
        maxOpacity={0.1}
        numSquares={30}
      />
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="mx-auto mt-6 max-w-xl text-4xl font-medium tracking-[-0.04em] sm:text-[2.75rem] md:text-6xl/[1.2]">
          Ship better UI without&nbsp;the&nbsp;hassle
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl/normal">
          Instead of starting from scratch every time, use thoughtfully designed
          blocks that give you a solid foundation for any UI.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button className="rounded-full" size="lg">
            Get Started <ArrowUpRight className="h-5! w-5!" />
          </Button>
          <Button
            className="rounded-full shadow-none"
            size="lg"
            variant="outline"
          >
            <CirclePlay className="h-5! w-5!" /> Watch Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
