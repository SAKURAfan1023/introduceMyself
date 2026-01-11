I will modify the scroll animation logic and styles as requested.

### Plan

1.  **Update `ScrollTextBright` Animation Logic**
    *   **File**: `app/containers/components/scrollTextBright/index.tsx`
    *   **Action**: Update the `useTransform` mapping for `mappedProgress`.
    *   **Change**: Modify `[0, 0.4, 1]` to `[0, 0.4, 0.8]` (mapping to `[0, 0, 1]`). This ensures the text lighting animation completes at 80% scroll and remains static (fully lit) from 80% to 100%.

2.  **Update `ScrollCardSplit` Layout & Styling**
    *   **File**: `app/containers/components/scrollCardSplit/index.tsx`
    *   **Logic Change (Curtain Effect)**:
        *   Add a negative top margin (`-mt-[80vh]`) to the `ScrollCardSplit` container. This will physically pull the component up to overlap the final 20% (0.8-1.0) of the `ScrollTextBright` section.
        *   Add `z-20` to ensure it covers the previous component.
        *   The existing entry animation (moving from `100vh` to `0vh`) combined with this overlap will create the "curtain rising to cover" effect during the static phase of the previous component.
    *   **Style Change**:
        *   Set the main container background to `bg-black`.
        *   Update the `GridPattern` component usage to have white grid lines (`stroke-white/20`) instead of the default gray.

### Verification
*   Verify that the text in `ScrollTextBright` finishes animating earlier and stays lit.
*   Verify that `ScrollCardSplit` rises up to cover the screen while `ScrollTextBright` is in its final static phase.
*   Verify `ScrollCardSplit` has a black background with white grid lines.
