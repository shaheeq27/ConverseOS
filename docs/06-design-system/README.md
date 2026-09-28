# 🎨 ConverseOS Design System & UI Standards

## 1. Approved Third-Party UI Stack
All developers must use the approved UI stack:
- **Component Foundation**: `shadcn/ui` patterns
- **Primitives**: `Radix UI`
- **Component Variants**: `class-variance-authority` (CVA)
- **Class Merging**: `clsx` + `tailwind-merge` (`cn()`)
- **Icons**: `Lucide React` (Interface) & Custom SVG (Branding)
- **Theme Engine**: `next-themes` (Dark/Light/System)
- **Toasts**: `Sonner`

## 2. Component Convention
Every UI component must follow this structure:
```tsx
// 1. Imports
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

// 2. Variants (CVA)
export const elementVariants = cva("...", { ... });

// 3. Props Interface
export interface ElementProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elementVariants> {}

// 4. Component Definition with ForwardRef
export const Element = React.forwardRef<HTMLDivElement, ElementProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(elementVariants({ variant, className }))} {...props} />;
  }
);

// 5. Display Name & Export
Element.displayName = "Element";
```

## 3. Quality Checklist
Before considering a UI component complete:
- [x] Responsive on mobile, tablet, and desktop
- [x] Accessible with ARIA labels
- [x] Full keyboard focus support
- [x] Dark, Light, and System theme compatible
- [x] Loading, Error, and Empty state handling
- [x] Type-safe props
- [x] Exported in `src/components/ui/index.ts`
- [x] Rendered in `/playground` showcase

## 4. Icon & Illustration Strategy
- `public/logos/`: Enterprise brand logos & marks
- `public/illustrations/`: SVG empty states & illustrations
- `public/icons/`: SVG icon overrides
