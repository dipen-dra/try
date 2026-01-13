"use client"

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  )
}

export default Textarea;
