
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pillVariants = cva(
  "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white/90 border border-white/20 hover:bg-white/20",
        primary: "bg-white text-black hover:bg-gray-200",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
        success: "bg-green-600/20 text-green-200 border border-green-400/30 hover:bg-green-600/30",
        info: "bg-blue-600/20 text-blue-200 border border-blue-400/30 hover:bg-blue-600/30",
        warning: "bg-yellow-600/20 text-yellow-200 border border-yellow-400/30 hover:bg-yellow-600/30",
        status: "bg-green-600 text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-2 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {}

function Pill({ className, variant, size, ...props }: PillProps) {
  return (
    <div className={cn(pillVariants({ variant, size }), className)} {...props} />
  )
}

export { Pill, pillVariants }
