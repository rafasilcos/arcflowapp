import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "info"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseClasses = "relative w-full rounded-lg border p-4"
    const variantClasses = {
      default: "bg-gray-50 border-gray-200 text-gray-900",
      destructive: "bg-red-50 border-red-200 text-red-900",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
      info: "bg-blue-50 border-blue-200 text-blue-900",
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 