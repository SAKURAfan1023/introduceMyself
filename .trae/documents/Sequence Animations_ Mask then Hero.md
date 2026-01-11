# Coordinate LoadingMask and MouseParallaxHero Animations

## 1. Lift State to `app/page.tsx`

*   Create a state variable `isHeroVisible` (default `false`) in `Home` component.
*   Pass a callback `onAnimationComplete` to `<LoadingMask />`.
*   Pass `isHeroVisible` as a prop to `<MouseParallaxHero />`.

## 2. Update `app/containers/components/loadingMask/index.tsx`

*   Accept an `onAnimationComplete` prop.
*   Call this prop when the final "curtain opening" animation finishes (`step === 'finished'`).

## 3. Update `app/containers/components/home/MouseParallaxHero.tsx`

*   Accept an `active` prop (boolean).
*   Modify the initial state of animations. The Hero content (images and text) should start in a "hidden" or "waiting" state.
*   Only trigger the entrance animation (flying in from edges) when `active` becomes `true`.

## 4. Implementation Details

*   **Page**: `const [showHero, setShowHero] = useState(false);`
*   **LoadingMask**: `onAnimationComplete={() => setShowHero(true)}`
*   **Hero**: Use `useEffect` or `animate` prop to trigger entrance only when `active` is true. currently `isVisible` controls scroll visibility; we need a separate "entrance" trigger.

