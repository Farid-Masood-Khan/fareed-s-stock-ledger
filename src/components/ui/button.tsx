
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:brightness-110 hover:shadow-md shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        destructive: "bg-gradient-to-r from-destructive to-red-500 text-destructive-foreground hover:brightness-110 hover:shadow-md shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        outline: "border border-input bg-background/80 hover:bg-accent/70 hover:text-accent-foreground hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        ghost: "hover:bg-accent/70 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-gradient-to-r from-brand-100 to-brand-50 text-brand-800 hover:brightness-105 hover:shadow-sm dark:from-brand-900/30 dark:to-brand-800/20 dark:text-brand-400 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        subtle: "bg-muted/80 hover:bg-muted/60 text-muted-foreground hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-md dark:bg-black/20 dark:hover:bg-black/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-2.5 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        xl: "rounded-xl",
        lg: "rounded-lg",
        sm: "rounded-sm",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, isLoading = false, loadingText, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
