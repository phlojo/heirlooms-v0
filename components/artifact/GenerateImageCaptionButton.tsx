"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface GenerateImageCaptionButtonProps {
  artifactId: string
  imageUrl: string
}

export function GenerateImageCaptionButton({ artifactId, imageUrl }: GenerateImageCaptionButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/analyze/image-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artifactId, imageUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate caption")
      }

      toast({
        title: "Success",
        description: "AI caption generated successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error generating caption:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate caption",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleGenerate} disabled={isGenerating} variant="ghost" size="sm" className="h-8 text-xs">
      {isGenerating ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
      )}
      Generate AI Caption
    </Button>
  )
}
