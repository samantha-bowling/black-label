
import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  level?: 1 | 2 | 3
}

export function SectionHeader({ 
  title, 
  subtitle, 
  level = 2, 
  className, 
  ...props 
}: SectionHeaderProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  
  const headingClasses = {
    1: "text-2xl font-semibold mb-6",
    2: "text-lg font-semibold mb-4", 
    3: "text-base font-semibold mb-3"
  }

  return (
    <div className={cn("mb-6", className)} {...props}>
      <HeadingTag className={cn(
        "text-white uppercase tracking-wide",
        headingClasses[level]
      )}>
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-white/70 text-sm mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}
