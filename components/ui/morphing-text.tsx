"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const morphTime = 1.5
const cooldownTime = 0.5

const useMorphingText = (
  texts: string[],
  start: boolean = true,
  loop: boolean = true,
  onFinish?: () => void
) => {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())

  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)

  // Track if we have finished the sequence
  const isFinishedRef = useRef(false);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

      const invertedFraction = 1 - fraction
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100
      )}px)`
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`

      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
    },
    [texts]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / morphTime

    if (fraction > 1) {
      cooldownRef.current = cooldownTime
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1) {
      textIndexRef.current++

      // Check if we should stop
      if (!loop && textIndexRef.current >= texts.length - 1) {
        isFinishedRef.current = true;
        if (onFinish) onFinish();
      }
    }
  }, [setStyles, loop, texts.length, onFinish])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const [current1, current2] = [text1Ref.current, text2Ref.current]
    if (current1 && current2) {
      current2.style.filter = "none"
      current2.style.opacity = "100%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
    }
  }, [])

  // Initial render effect
  useEffect(() => {
    // If not started, set initial styles to show first text
    if (!start) {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (current1 && current2) {
        current1.textContent = texts[0];
        current1.style.filter = "none";
        current1.style.opacity = "100%";

        current2.textContent = texts[1] || "";
        current2.style.filter = "blur(100px)"; // Start hidden/blurred
        current2.style.opacity = "0%";
      }
    }
  }, [start, texts]);

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!start || isFinishedRef.current) return;

      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime

      cooldownRef.current -= dt

      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }

    // Reset time reference when starting
    if (start) {
      timeRef.current = new Date();
    }

    animate()
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown, start])

  return { text1Ref, text2Ref }
}

interface MorphingTextProps {
  className?: string
  texts: string[]
  start?: boolean
  loop?: boolean
  onFinish?: () => void
}

const Texts: React.FC<MorphingTextProps> = ({ texts, start, loop, onFinish }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, start, loop, onFinish)
  return (
    <>
      <span
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  )
}

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  start = true,
  loop = true,
  onFinish
}) => (
  <div
    className={cn(
      "relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] leading-none font-bold [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]",
      className
    )}
  >
    <Texts texts={texts} start={start} loop={loop} onFinish={onFinish} />
    <SvgFilters />
  </div>
)
