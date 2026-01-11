I will implement the requested animations by modifying `app/containers/components/scrollCardSplit/index.tsx`.

### 1. Viewport Frame Animation (0.1 - 0.9)
I will add a fixed frame effect to the sticky container that responds to scroll progress from 0.1 to 0.9.
- **Animation Logic**: 
  - **Position**: Moves from negative offsets (outside viewport) to positive offsets (inside).
  - **Thickness**: Border width increases (e.g., from 2px to 8px).
  - **Size**: The length of the frame arms (width/height) will also scale up.
- **Structure**:
  - Two "L" shaped corner elements created using `div`s.
  - **Top-Left**: Animated `top`, `left`, `border-width`.
  - **Bottom-Right**: Animated `bottom`, `right`, `border-width`.

### 2. Card Corner Frames (Card 1 & 3)
I will update the `Card` component to include corner indicators for the specific cards.
- **Card 1 (Index 0)**: Adds a Top-Left corner frame.
- **Card 3 (Index 2)**: Adds a Bottom-Right corner frame.
- **Implementation**:
  - Use `motion.div` with absolute positioning.
  - **Border Radius**: Bind the existing `borderRadius` motion value to these frames so they curve perfectly with the cards.
  - **Styling**: Use `border-top/left` for the first card and `border-bottom/right` for the third card to create the "L" shapes.

### 3. Implementation Steps
1.  Define new `useTransform` hooks in `ScrollCardSplit` for the viewport frame's position, thickness, and size.
2.  Insert the Viewport Frame markup into the main container.
3.  Modify the `Card` component to conditionally render corner frames based on the `index` prop and pass the `borderRadius` to them.
