# Update LoadingMask with MorphingText

## 1. Modify `components/ui/morphing-text.tsx`

*   Update `MorphingText` props to support `start` (boolean), `loop` (boolean), and `onComplete` (callback).
*   Modify `useMorphingText` hook:
    *   Accept the new control props.
    *   Initialize the text styles immediately (`setStyles(0)`).
    *   Only start the animation loop when `start` is true.
    *   Stop the animation and call `onComplete` when the transition sequence finishes (if `loop` is false).

## 2. Update `app/containers/components/loadingMask/index.tsx`

*   Replace `TextReplacement` with `MorphingText`.
*   Update state management:
    *   Initial state: `start={false}`, showing "Newbie Village".
    *   On Click: Set `start={true}` to trigger the morph to "Department Ceremony".
    *   On Complete: Handle the callback to transition to the "waiting" or "expanding" stage (Curtain Animation).
*   Remove the old `TextReplacement` import and logic.

## 3. Cleanup

*   Delete `app/containers/components/loadingMask/text-replacement.tsx`.
