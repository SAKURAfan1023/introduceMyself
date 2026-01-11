I will modify `app/containers/components/scrollCardSplit/index.tsx` to implement the requested visual changes.

### 1. Implement X-Axis Flip (0.1 - 0.2)

* I will create a new `useTransform` for `containerRotateX` mapped to `scrollYProgress` from `0.1` to `0.2`.

* **Value**: It will transition from `"30deg"` (tilted back) to `"0deg"` (upright/flat), simulating the "picking up a paper to read" effect as requested.

* **Application**: I will apply this `rotateX` style to the main cards container (`motion.div` that currently handles `y`, `scale`, and `gap`).

### 2. Remove Border Radius

* I will find all instances of `rounded-xl` in the `Card` component.

* I will replace them with `rounded-none` to ensure the cards are perfectly square/rectangular as requested.

  <br />

