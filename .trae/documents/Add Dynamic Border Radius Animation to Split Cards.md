I will implement the requested `borderRadius` animation logic to create the effect of one image splitting into three distinct cards.

1.  **Define `cardsBorderRadius` Animation**:
    *   In `app/containers/components/scrollCardSplit/index.tsx`, inside `ScrollCardSplit`, I will add a new `useTransform` hook called `cardsBorderRadius`.
    *   It will synchronize with `cardsGap` using the same scroll ranges `[0.3, 0.4, 0.7, 0.8]`.
    *   The values will transition from `"0px"` (when merged) to `"20px"` (when separated), and back to `"0px"`.

2.  **Update `Card` Component Props**:
    *   Modify the `Card` component's props interface to accept `borderRadius` of type `MotionValue<string>`.

3.  **Apply `borderRadius` to Card Faces**:
    *   Pass the `cardsBorderRadius` from `ScrollCardSplit` to each `Card` instance.
    *   Inside the `Card` component, convert the inner container `div`s (for both the front and back faces) to `motion.div`.
    *   Bind the `borderRadius` style to these `motion.div` elements so they animate smoothly.

This will ensure that as the cards separate (gap increases), their corners round off, and as they merge, they become sharp again to form a seamless single image.