import Image from "next/image"
import Link from "next/link"
import { cn } from "noxkit/lib/utils"
import logoDark from "../app/logo-dark.png"
import logoLight from "../app/logo-light.png"

export function MyLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60",
        className
      )}
    >
      <Image
        src={logoLight}
        alt="Nox"
        priority
        className="h-6 w-auto dark:hidden"
      />
      <Image
        src={logoDark}
        alt="Nox"
        priority
        className="hidden h-6 w-auto dark:block"
      />
    </Link>
  )
}
