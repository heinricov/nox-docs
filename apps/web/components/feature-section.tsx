import type { LucideIcon } from "lucide-react"
import {
  ChartBar,
  ChartLine,
  Flashlight,
  LayoutGrid,
  Settings,
  ShieldCheck,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type Feature = {
  icon: LucideIcon
  title: string
  copy: string
}

const features: Feature[] = [
  {
    icon: Flashlight,
    title: "Lightning fast",
    copy: "Ship in milliseconds with an edge-first runtime tuned for speed.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    copy: "Encryption, audit logs, and granular access baked into every layer.",
  },
  {
    icon: LayoutGrid,
    title: "Composable blocks",
    copy: "Drop in sharp, accessible components and compose them your way.",
  },
  {
    icon: ChartBar,
    title: "Real-time insights",
    copy: "Track usage and performance the moment events happen.",
  },
  {
    icon: ChartLine,
    title: "Scales with you",
    copy: "From first user to millions without re-architecting a thing.",
  },
  {
    icon: Settings,
    title: "Fully configurable",
    copy: "Tune defaults, theming, and workflows to fit your team.",
  },
]

export default function FeatureSection() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Features
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to build
          </h2>
          <p className="mt-3 text-muted-foreground">
            A focused toolkit that gets out of your way so you can move fast.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon: Icon, title, copy }) => (
            <Card key={title} className="p-6">
              <CardHeader className="p-0">
                <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="mt-4 text-base font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm">
                  {copy}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
