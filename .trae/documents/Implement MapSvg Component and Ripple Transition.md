I will implement the `MapSvg` component with scroll-driven zoom/pan animations and integrate the ripple transition effect as requested.

### **1. Modify `DraggableCardDemo`**
- **File:** `app/containers/components/dragShow/index.tsx`
- **Action:** 
  - Update component to accept an `onTitleClick` callback prop.
  - Add `onClick={onTitleClick}` and `cursor-pointer` style to the card title (`<h3>`).

### **2. Create `MapSvg` Component**
- **File:** `app/containers/components/mapSvg/index.tsx`
- **Structure:**
  - A full-screen container.
  - **China Map:** Centered SVG (using `img/chinese.svg`).
  - **Sichuan Map:** Absolutely positioned child (using `img/SiChuan.svg`), initially placed at the bottom-left (approx. 10-20% offset) relative to the China map.
- **Animation (Framer Motion):**
  - Bind `scale` and `transform` (x/y) to `useScroll`.
  - **Effect:** Scrolling down zooms in the map and pans towards the Sichuan region.

### **3. Integrate & Animate in `page.tsx`**
- **File:** `app/page.tsx`
- **State Management:** Add state to track the transition (`isMapRevealed`).
- **Layout Changes:**
  - Set `DraggableCardDemo` to `absolute` positioning so it overlays the content initially.
  - Add a **Transition Wrapper** (Ripple Effect) that sits below or overlays based on the animation state.
- **Transition Logic:**
  - Use a `motion.div` with `clip-path` animation (`circle(0%)` -> `circle(150%)`).
  - **Trigger:** Clicking the title in `DraggableCardDemo` starts the expansion.
  - **Content:** The expanding circle reveals the `MapSvg` component inside it, creating the water ripple effect.

### **4. Verification**
- I will verify the click interaction triggers the ripple.
- I will verify the map scales and moves correctly on scroll.
