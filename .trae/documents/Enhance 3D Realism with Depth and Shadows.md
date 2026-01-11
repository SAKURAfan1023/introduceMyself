I will enhance the 3D realism of the flip animation by implementing the following changes in `app/containers/components/scrollCardSplit/index.tsx`:

### 1. Increase Perspective
* I will update the container's perspective style from `perspective-1000` to a custom, stronger value (e.g., `perspective-[1000px]` or slightly lower like `800px`) to exaggerate the 3D depth effect.
* I will ensure the perspective is applied to the parent container of the cards.

### 2. Add "Z-Axis" Movement (Depth)
* Currently, the flip only rotates on the X-axis (`rotateX`).
* To add depth, I will introduce a `z` (translateZ) transform during the flip.
* **Logic**: As the card rotates from 30deg to 0deg (or during the scale phase), I will make it slightly "move away" and then "come closer" (or vice versa) using `z`.
* However, a more effective "paper pickup" feel is usually achieved by combining `rotateX` with `y` and `scale`. The user specifically asked for "depth of field" (景深).
* **New Plan**: I will add a `z` transform to the `containerRotateX` phase (0.1 - 0.2).
    * `z`: `["-100px", "0px"]` (starts further away, comes closer as it stands up).
    * This creates a true 3D movement where the bottom of the card stays anchored while the top rotates towards the viewer.

### 3. Add Shadow/Lighting (Simulated)
* Real objects cast shadows or have highlights when they move.
* I will add a `boxShadow` or `filter: drop-shadow` transition.
* **Implementation**:
    * When tilted back (0.1), the shadow should be longer/softer.
    * When upright (0.2), the shadow should be tighter.
    * I will add a `boxShadow` transform to the cards container.

### 4. Refine Rotation Anchor
* By default, rotation happens from the center (`transform-origin: center`).
* For a "standing up" effect, it often looks more realistic if it rotates from the *bottom*.
* I will set `transformOrigin: "bottom center"` (or similar) during the rotation phase to make it look like it's pivoting on its base.

### Summary of Changes to `app/containers/components/scrollCardSplit/index.tsx`:
1.  **Perspective**: Ensure parent has strong perspective.
2.  **Transform Origin**: Set `transformOrigin: "50% 100%"` (bottom center) for the card container.
3.  **Z-Axis**: Add `z` transform `[-100px, 0px]`.
4.  **Shadow**: Add dynamic `boxShadow` to enhance depth.
