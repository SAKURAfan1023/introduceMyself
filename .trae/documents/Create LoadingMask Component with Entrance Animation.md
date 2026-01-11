# Create LoadingMask Component with Text and Curtain Animation

## 1. Create Component Structure

* Create directory: `app/containers/components/loadingMask/`

* Create `text-replacement.tsx`: Handles the "Newbie Village" -> "Departure CereMony" animation.

  * Implement letter-by-letter replacement using `framer-motion`.

  * Use `overflow-hidden` container for each letter to handle the "move out down, move in from top" effect.

  * Handle different string lengths dynamically.

* Create `index.tsx`: Main `LoadingMask` component.

  * **State Management**: Track steps (`initial`, `replacing`, `waiting`, `expanding`, `opening`, `finished`).

  * **Interaction**: Click handlers to trigger state transitions.

  * **Curtain Animation**:

    * Use a "Hole Punch" technique: A white background overlay with a `mix-blend-mode: destination-out` div (the "window") inside it.

    * **Phase 1 (Expand Width)**: The window expands from `width: 0` to `100vw` (left to right).

    * **Phase 2 (Expand Height)**: The window expands from `height: 10px` to `100vh` (center out), creating the "opening up and down" effect.

  * **Z-Index**: Ensure it sits on top of everything (`z-[100]`).

## 2. Animation Details

* **Text Animation**:

  * Trigger: First Click.

  * Duration: \~1.5s total with staggering.

  * Easing: Smooth ease-out.

* **Curtain Animation**:

  * Trigger: Second Click (after text animation).

  * Step 1: `width` 0 -> 100vw. Duration \~0.8s.

  * Step 2: `height` 2px -> 100vh. Duration \~1.2s.

  * Visual: The white screen will "split" or "open" to reveal the underlying `MouseParallaxHero`.

## 3. Integration

* Update `app/page.tsx`:

  * Import `LoadingMask`.

  * Mount it at the top of the component tree.

  * Ensure it is conditionally rendered or handles its own visibility state to not block interaction after completion.

