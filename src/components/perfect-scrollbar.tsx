// src/components/ui/perfect-scrollbar.tsx
"use client";

import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { cn } from "@/lib/utils";

interface PerfectScrollbarProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
}

const CustomScrollbar = React.forwardRef<HTMLDivElement, PerfectScrollbarProps>(
  ({ children, className, options, ...props }, ref) => {
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <PerfectScrollbar
          options={{
            suppressScrollX: true,
            ...options,
          }}
        >
          {children}
        </PerfectScrollbar>
      </div>
    );
  }
);

CustomScrollbar.displayName = "CustomScrollbar";

export { CustomScrollbar };
