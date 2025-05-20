import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
)

const Checkbox = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <label className="inline-flex items-center space-x-2 rtl:space-x-reverse">
    <span className="relative">
      <input
        type="checkbox"
        ref={ref}
        className={cn(checkboxVariants(), className)}
        {...props}
      />
      <span className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
        <CheckIcon className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
      </span>
    </span>
  </label>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
