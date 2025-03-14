'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
  Users,
  Share2,
} from 'lucide-react'

export function LivestreamPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [viewerCount] = useState(1248)

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {/* Video placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/placeholder.svg?height=720&width=1280"
          alt="Livestream video"
          className="size-full object-cover"
        />
      </div>

      {/* Overlay for controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100">
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
              LIVE
            </span>
            <span className="flex items-center gap-1 text-sm text-white">
              <Users className="size-3.5" />
              {viewerCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
          <Slider defaultValue={[0]} max={100} step={1} className="h-1" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5" />
                )}
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="size-5" />
                  ) : (
                    <Volume2 className="size-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="h-1 w-24"
                  onValueChange={(value) => {
                    setVolume(value[0])
                    setIsMuted(value[0] === 0)
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <MessageSquare className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
