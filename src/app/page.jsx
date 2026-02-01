"use client"

import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import CakeScreen from "@/components/screens/CakeScreen"
import PhotosScreen from "@/components/screens/PhotosScreen"
import MessageScreen from "@/components/screens/MessageScreen"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [musicStarted, setMusicStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef(null)

  // 🎵 Start music ONLY once (IntroScreen button click)
  const startMusicOnce = () => {
    if (!audioRef.current || musicStarted) return

    audioRef.current.volume = 0.3
    audioRef.current.play().catch(() => {})
    setMusicStarted(true)
  }

  // 🔇 Toggle music
  const toggleMusic = () => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
      setIsMuted(false)
    } else {
      audioRef.current.pause()
      setIsMuted(true)
    }
  }

  const screens = [
    // 0 — Loader (NO music here)
    <LoaderScreen
      key="loader"
      onDone={() => setCurrentScreen(1)}
    />,

    // 1 — Intro (🎯 MUSIC STARTS HERE)
    <IntroScreen
      key="intro"
      onStartMusic={startMusicOnce}
      onNext={() => setCurrentScreen(2)}
    />,

    // 2 — Cake
    <CakeScreen
      key="cake"
      onNext={() => setCurrentScreen(3)}
    />,

    // 3 — Photos
    <PhotosScreen
      key="photos"
      onNext={() => setCurrentScreen(4)}
    />,

    // 4 — Message
    <MessageScreen
      key="message"
      onNext={() => setCurrentScreen(5)}
    />,
  ]

  return (
    <main className="min-h-screen bg-gradient-to-tr from-rose-950/40 via-black to-rose-950/40 overflow-hidden relative">

      {/* 🎵 Background Music (TOP LEVEL) */}
      <audio
        ref={audioRef}
        src="/music/bgm.mp3"
        loop
        preload="auto"
      />

      {/* 🔊 Music Toggle */}
      {musicStarted && (
        <button
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 rounded-full bg-black/40 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/60 transition"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
            className={`w-full ${
              currentScreen === 3
                ? "max-w-7xl"
                : "max-w-3xl md:max-w-4xl"
            }`}
          >
            {screens[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed bottom-4 right-4 text-sm text-white/40 pointer-events-none z-50 font-light"
      >
        Made with ❤️ by Muzammil
      </motion.div>
    </main>
  )
}
