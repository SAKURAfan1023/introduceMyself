I will update the `ScrollCardSplit` component to improve visibility and contrast against the black background.

### Plan

1.  **Modify `ScrollCardSplit` Component**
    *   **File**: `app/containers/components/scrollCardSplit/index.tsx`
    *   **Title & Subtitle**:
        *   Change `h2` text color from `text-neutral-900` to `text-white` (or `text-neutral-100`).
        *   Change `p` text color from `text-neutral-600` to `text-neutral-400`.
    *   **Grid Pattern**:
        *   Increase visibility by changing `stroke-white/20` to `stroke-white/40` (higher opacity).
        *   Increase thickness by adding the `strokeWidth={2}` prop to the `GridPattern` component (default is usually 1).

### Verification
*   Verify that the title "Scroll Animation" is clearly visible (white) against the black background.
*   Verify that the grid lines are brighter and thicker.
