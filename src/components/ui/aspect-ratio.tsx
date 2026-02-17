import * as React from "react"

import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden", className)}
        style={{ ...style, aspectRatio: `${ratio}` }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
