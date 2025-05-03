
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
  tooltipClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showTooltip = false, formatTooltip, tooltipClassName, ...props }, ref) => {
  const [hoveredThumb, setHoveredThumb] = React.useState<number | null>(null);
  
  const handleTooltipValue = (index: number): string => {
    if (!props.value) return "";
    const value = Array.isArray(props.value) ? props.value[index] : props.value;
    return formatTooltip ? formatTooltip(value) : `${value}`;
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted/70 dark:bg-muted/40 shadow-inner">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-500 dark:to-brand-400" />
      </SliderPrimitive.Track>
      {Array.isArray(props.value) ? 
        props.value.map((_, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb 
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-brand-600 bg-white shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted cursor-pointer dark:border-brand-500 dark:bg-background hover:scale-110 hover:shadow-md",
                props.disabled && "opacity-50 cursor-not-allowed"
              )}
              onMouseEnter={() => setHoveredThumb(index)}
              onMouseLeave={() => setHoveredThumb(null)}
            />
            {showTooltip && hoveredThumb === index && (
              <div 
                className={cn(
                  "absolute -top-8 rounded-md bg-gradient-to-r from-brand-600 to-brand-500 text-white px-2 py-1 text-xs animate-fade-in shadow-md",
                  tooltipClassName
                )}
                style={{
                  left: `calc(${(props.value[index] - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - 12px)`
                }}
              >
                {handleTooltipValue(index)}
              </div>
            )}
          </React.Fragment>
        )) : (
          <>
            <SliderPrimitive.Thumb 
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-brand-600 bg-white shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted cursor-pointer dark:border-brand-500 dark:bg-background hover:scale-110 hover:shadow-md",
                props.disabled && "opacity-50 cursor-not-allowed"
              )}
              onMouseEnter={() => setHoveredThumb(0)}
              onMouseLeave={() => setHoveredThumb(null)}
            />
            {showTooltip && hoveredThumb === 0 && (
              <div 
                className={cn(
                  "absolute -top-8 rounded-md bg-gradient-to-r from-brand-600 to-brand-500 text-white px-2 py-1 text-xs animate-fade-in shadow-md",
                  tooltipClassName
                )}
                style={{
                  left: `calc(${((props.value as number) - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - 12px)`
                }}
              >
                {handleTooltipValue(0)}
              </div>
            )}
          </>
        )
      }
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
