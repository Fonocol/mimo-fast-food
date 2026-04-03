"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export function Toast({ message, type = 'success', duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'

  return createPortal(
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>,
    document.body
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info'; duration: number }>>([])

  const show = (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  return { show, toasts }
}
