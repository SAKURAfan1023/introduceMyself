I will implement the `ScrollCardSplit` component as a scroll-linked animation using `framer-motion` (specifically the `motion` package) and integrate it into your main page.

### 1. Create Component: `app/containers/components/scrollCardSplit/index.tsx`
I will create a new component that matches your detailed animation specifications.

**Structure:**
- **Main Container**: A tall container (e.g., `300vh`) to provide scroll distance.
    - Attached `ref` for `useScroll`.
    - `useScroll` with `offset: ["start end", "end end"]` as requested.
- **Sticky Wrapper**: A `sticky top-0 h-screen` inner container to keep the content centered in the viewport while the animation plays.
- **Content Layout**:
    - **Title Container**: Positioned at the top/center.
    - **Cards Container**: Three rectangular divs side-by-side.

**Animation Logic (mapped from `scrollYProgress` 0-1):**
- **0 - 0.1**: Cards float up from bottom to center.
- **0.1 - 0.2**: Cards scale up (unified scaling).
- **0.15 - 0.2**: Title appears from behind (depth effect) and scales up.
- **0.2 - 0.3**: Gap between cards increases.
- **0.3 - 0.4**: Background images change (Image 1 → Image 2).
- **0.4 - 0.5**: Buffer (no change).
- **0.5 - 0.7**: 3D Flip effect (rotateY 180deg). Background changes to Image 3 (using backface/frontface logic).
- **0.7 - 0.8**: Gap closes.
- **0.8 - 0.9**: Title fades out, Cards scale down.
- **0.9 - 1**: Cards move up out of viewport.

**Implementation Details:**
- I will use `useTransform` to map the scroll progress to CSS values (`y`, `scale`, `opacity`, `gap`, `rotateY`).
- I will use placeholder styles (gradients/colors) for the background images since no assets were provided, but structure it so you can easily swap in real `<img>` or `bg-image` URLs.

### 2. Update `app/page.tsx`
- Import the new `ScrollCardSplit` component.
- Add it below the existing `MouseParallaxHero` component.

### 3. Validation
- I will verify the build to ensure no errors.
- Since I cannot run the browser to visually verify the animation smoothness, I will strictly adhere to the `framer-motion` API and your timing specifications.
