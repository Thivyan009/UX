import * as React from "react"

import { cn } from "@/lib/utils"

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive"
  }
>(({ className, children, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-right-full",
        variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm font-semibold [&+div]:text-muted-foreground", className)} {...props} />
  },
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("text-sm opacity-70", className)} {...props} />
  },
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
          className,
        )}
        {...props}
      >
        Close
      </button>
    )
  },
)
ToastClose.displayName = "ToastClose"

export type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  autoClose?: number
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactNode

export { Toast, ToastTitle, ToastDescription, ToastClose }
