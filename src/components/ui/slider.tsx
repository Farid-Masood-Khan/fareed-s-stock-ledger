
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
  tooltipClassName?: string;
  label?: string;
  ariaValueText?: (value: number) => string;
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  className, 
  showTooltip = false, 
  formatTooltip, 
  tooltipClassName, 
  label, 
  ariaValueText, 
  showLabels = false,
  minLabel,
  maxLabel,
  ...props 
}, ref) => {
  const [hoveredThumb, setHoveredThumb] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Fix hydration issues with SSR
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleTooltipValue = (index: number): string => {
    if (!props.value) return "";
    const value = Array.isArray(props.value) ? props.value[index] : props.value;
    return formatTooltip ? formatTooltip(value) : `${value}`;
  };

  const getValueText = (index: number): string => {
    if (!props.value) return "";
    const value = Array.isArray(props.value) ? props.value[index] : props.value;
    return ariaValueText ? ariaValueText(value) : `${value}`;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="relative">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          aria-label={label}
          {...props}
        >
          <SliderPrimitive.Track 
            className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <SliderPrimitive.Range className="absolute h-full bg-blue-500 dark:bg-blue-400" />
          </SliderPrimitive.Track>
          {Array.isArray(props.value) ? 
            props.value.map((_, index) => (
              <React.Fragment key={index}>
                <SliderPrimitive.Thumb 
                  className={cn(
                    "block h-4 w-4 rounded-full border border-gray-200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-offset-gray-900",
                    props.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onMouseEnter={() => setHoveredThumb(index)}
                  onMouseLeave={() => setHoveredThumb(null)}
                  onFocus={() => setHoveredThumb(index)}
                  onBlur={() => setHoveredThumb(null)}
                  aria-valuetext={getValueText(index)}
                />
                {showTooltip && hoveredThumb === index && (
                  <div 
                    className={cn(
                      "absolute -top-8 rounded-md bg-blue-500 text-white px-2 py-1 text-xs animate-fade-in shadow-md",
                      tooltipClassName
                    )}
                    style={{
                      left: `calc(${(props.value[index] - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - 12px)`
                    }}
                    role="tooltip"
                  >
                    {handleTooltipValue(index)}
                  </div>
                )}
              </React.Fragment>
            )) : (
              <>
                <SliderPrimitive.Thumb 
                  className={cn(
                    "block h-5 w-5 rounded-full border border-gray-200 bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-offset-gray-900",
                    props.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onMouseEnter={() => setHoveredThumb(0)}
                  onMouseLeave={() => setHoveredThumb(null)}
                  onFocus={() => setHoveredThumb(0)}
                  onBlur={() => setHoveredThumb(null)}
                  aria-valuetext={getValueText(0)}
                />
                {showTooltip && hoveredThumb === 0 && props.value !== undefined && (
                  <div 
                    className={cn(
                      "absolute -top-8 rounded-md bg-blue-500 text-white px-2 py-1 text-xs animate-fade-in shadow-md",
                      tooltipClassName
                    )}
                    style={{
                      left: `calc(${((props.value as number) - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - 12px)`
                    }}
                    role="tooltip"
                  >
                    {handleTooltipValue(0)}
                  </div>
                )}
              </>
            )
          }
        </SliderPrimitive.Root>
      </div>
      
      {/* Min/Max labels */}
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{minLabel || props.min || '0'}</span>
          <span>{maxLabel || props.max || '100'}</span>
        </div>
      )}
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
