"use client"

import { useState, useEffect } from "react"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"

export function Toaster() {
  const [toasts, setToasts] = useState<
    {
      id: string
      title: string
      description: string
      variant?: "default" | "destructive"
    }[]
  >([])

  useEffect(() => {
    const handleToast = (
      event: CustomEvent<{
        title: string
        description: string
        variant?: "default" | "destructive"
      }>,
    ) => {
      const { title, description, variant } = event.detail
      const id = Math.random().toString(36).substring(2, 9)

      setToasts((prev) => [...prev, { id, title, description, variant }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    }

    document.addEventListener("toast" as any, handleToast as any)

    return () => {
      document.removeEventListener("toast" as any, handleToast as any)
    }
  }, [])

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="flex flex-col gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
          <ToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        </Toast>
      ))}
    </div>
  )
}
