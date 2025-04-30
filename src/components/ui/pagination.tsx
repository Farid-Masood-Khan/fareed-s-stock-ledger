
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage = 1, totalPages = 1, onPageChange, children, ...props }, ref) => {
    const handlePageChange = (page: number) => {
      if (onPageChange) {
        onPageChange(page);
      }
    };
    
    return (
      <div 
        ref={ref}
        className={cn("flex items-center justify-center space-x-2 mt-4", className)}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Show a window of 5 pages around current page
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 5 + i + 1;
                  }
                }
                
                if (pageNum <= totalPages) {
                  return (
                    <Button 
                      key={i} 
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3"
            >
              Next
            </Button>
          </>
        )}
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
