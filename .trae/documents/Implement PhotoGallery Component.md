# Implement PhotoGallery Component

I will create a new `PhotoGallery` component with a 3-row infinite scroll effect that reacts to page scrolling velocity, as per your requirements.

## 1. Create Component Structure
*   **Directory**: Create `app/containers/components/photoGallery` (correcting spelling to "Gallery").
*   **Data File**: Create `data.ts` in that folder containing an object with 3 arrays of image URLs.

## 2. Implement Animation Logic (`index.tsx`)
*   **Core Logic**: Use `motion/react` (Framer Motion) to create a seamless infinite loop (Marquee effect).
*   **Scroll Interaction**:
    *   Use **Global `useScroll`** to track page scroll.
    *   Use `useVelocity` and `useSpring` to detect scroll speed and direction.
    *   Dynamically adjust the animation speed: accelerate when scrolling down, reverse/slow when scrolling up.
*   **Optimization**:
    *   Use `useInView` with a threshold (approx. 0.3) to detect when the component enters the viewport.
    *   **Performance**: Stop the animation loop logic completely when the component is out of the viewport.
*   **Layout**:
    *   3 Rows: Row 1 (Right), Row 2 (Left), Row 3 (Right).
    *   Styling: Flexbox with gaps between images and rows.

## 3. Integration
*   Import and mount the `PhotoGallery` component in `app/page.tsx` below the existing `ScrollCardSplit` component.

## Technical Details
*   **Dependencies**: Reuse existing `motion/react` (no new installs).
*   **Hooks**: `useScroll`, `useTransform`, `useSpring`, `useVelocity`, `useAnimationFrame`, `useMotionValue`, `useInView`.
