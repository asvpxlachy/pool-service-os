# Motion foundation

Use the existing visual design and shared motion components as the starting point for future screens. Do not replace gesture-following movement with release-only state switches.

- app/main-swipe.tsx owns page gestures: actual inert destination page beside current page, transform updates through requestAnimationFrame, distance/velocity completion and eased settle/cancel. Header and body move together. Scrolled job return previews begin at the visible viewport; commit returns to Today at scroll top. Enabled only for explicitly supported screen pairs; tabs/back remain usable.
- app/route-order.tsx owns held-route gestures: 400ms hold, body-portal floating card following the pointer, animated gap shifts, edge scrolling, settle before committing order and cancellation without saving a new order. Keyboard/arrows remain available; button reorder uses FLIP movement.
- Exactly one component owns each gesture. Schedule does not enable page swiping. Editing fields, photo controls and modal sheets keep their own interactions. Vertical scrolling stays native. Recognized swipes suppress accidental clicks; inactive destination pages are inert and hidden from assistive navigation.
- Transient pointer positions, transforms, timers and animation handles are not persisted. Only completed actions update existing app state. Cancel animation frames, timers and animations on cancellation/unmount/navigation.
- Respect prefers-reduced-motion: retain direct manipulation but remove settling/entry/FLIP duration and scale effects. Do not remove accessible button/keyboard alternatives.
- Before extending motion, check intermediate following, cancel, completion, scrolling, reduced motion, focus and data preservation with synthetic browser data. A passing build alone does not verify gesture quality. Physical phone/Safari feel still needs owner/device validation.

Current navigation: Today left to Clients; Clients right to Today; active job left to Today. No new dependencies or storage schema. Implementation approval does not silently authorize deployment.
