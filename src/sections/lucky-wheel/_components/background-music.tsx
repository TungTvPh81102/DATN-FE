// 'use client'
//
// import { useState, useRef, useEffect } from 'react'
// import { VolumeX, Volume2 } from 'lucide-react'
//
// export default function BackgroundMusic() {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isLoaded, setIsLoaded] = useState(false)
//   const audioRef = useRef<HTMLAudioElement | null>(null)
//
//   useEffect(() => {
//     // Create audio element directly in the DOM for better browser compatibility
//     const audio = document.createElement('audio')
//     audio.src = '/sounds/background-music.mp3'
//     audio.loop = true
//     audio.volume = 0.3
//     audio.preload = 'auto'
//
//     // Add event listeners
//     audio.addEventListener('canplaythrough', () => {
//       console.log('Background music loaded successfully')
//       setIsLoaded(true)
//     })
//
//     audio.addEventListener('error', (e) => {
//       console.error('Error loading background music:', e)
//       setIsLoaded(false)
//     })
//
//     // Start loading the audio
//     audio.load()
//
//     // Store the audio element
//     audioRef.current = audio
//
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause()
//         audioRef.current.src = ''
//         audioRef.current = null
//       }
//     }
//   }, [])
//
//   const toggleMusic = () => {
//     if (!audioRef.current || !isLoaded) return
//
//     if (isPlaying) {
//       audioRef.current.pause()
//       setIsPlaying(false)
//     } else {
//       // Use a promise with proper error handling
//       const playPromise = audioRef.current.play()
//
//       if (playPromise !== undefined) {
//         playPromise
//           .then(() => {
//             setIsPlaying(true)
//           })
//           .catch((error) => {
//             console.error('Error playing background music:', error)
//             // Try an alternative approach - add to DOM and play
//             document.body.appendChild(audioRef.current!)
//             audioRef
//               .current!.play()
//               .then(() => setIsPlaying(true))
//               .catch((e) => console.error('Second attempt failed:', e))
//           })
//       }
//     }
//   }
//
//   return (
//     <button
//       onClick={toggleMusic}
//       disabled={!isLoaded}
//       className={`fixed bottom-6 left-6 z-50 rounded-full p-3 transition-all ${
//         isLoaded
//           ? 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/40'
//           : 'cursor-not-allowed bg-gray-200 text-gray-400'
//       }`}
//       aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
//     >
//       {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
//     </button>
//   )
// }
'use client'

import { useState, useRef, useEffect } from 'react'
import { VolumeX, Volume2 } from 'lucide-react'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/sounds/background-music.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'

    audio.addEventListener('canplaythrough', () => {
      console.log('Background music loaded successfully')
      setIsLoaded(true)
    })

    audio.addEventListener('error', (e) => {
      console.error('Error loading background music:', e)
      setIsLoaded(false)
    })

    audioRef.current = audio

    // Tự động phát nhạc khi trang load
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.warn('Autoplay bị chặn, cần user tương tác:', error)
          })
      }
    }

    playMusic()

    // Nếu autoplay bị chặn, đợi user click lần đầu để bật nhạc
    document.addEventListener('click', playMusic, { once: true })

    return () => {
      document.removeEventListener('click', playMusic)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Error playing music:', error))
    }
  }

  return (
    <button
      onClick={toggleMusic}
      disabled={!isLoaded}
      className={`fixed bottom-6 left-6 z-50 rounded-full p-3 transition-all ${
        isLoaded
          ? 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/40'
          : 'cursor-not-allowed bg-gray-200 text-gray-400'
      }`}
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  )
}
