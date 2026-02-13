# Fika App UI Design and Layout - Comprehensive Overview

## App Purpose
**Fika** is a personal finance tracking application that helps users manage their money across multiple currencies (CNY and USD). The app tracks income, expenses, accounts, subscriptions, and personal equity with features like:
- Multi-currency transaction tracking
- Subscription management
- Personal equity vs. total assets differentiation
- Account-based filtering
- Bilingual support (English and Chinese)
- Timezone-aware transaction recording

## Design Philosophy & Theme

### **"Swedish Coffee Culture" Aesthetic**
The app is built around a warm, cozy "Fika" theme (Swedish coffee break tradition), featuring:
- Organic, natural color palette inspired by coffee culture
- Soft, rounded corners (border-radius: 12-24px throughout)
- Gentle shadows and subtle animations
- Approachable, friendly typography
- "Bento Box" card-based layout system

### **Color Palette**
The entire color system is based on coffee/café tones:

**Primary Colors:**
- **Cream** (#FDF8F3): Very light background
- **Latte** (#F5EDE6): Card backgrounds, secondary surfaces
- **Caramel** (#E8D5C4): Hover states, borders
- **Cinnamon** (#C4A484): Secondary text, muted elements
- **Espresso** (#5C4033): Primary text, dark elements
- **Mocha** (#3D2B1F): Deepest dark (overlays, emphasis)

**Accent Colors:**
- **Honey** (#E6A756): Primary accent, highlights, active states
- **Berry** (#A85D5D): Expenses, warnings, delete actions
- **Sage** (#8BA888): Income, positive indicators
- **Sky** (#7BA3C4): Informational elements

**Background:** #FFFBF7 (warm off-white)

### **Typography**
**Font Strategy:**
- **Headings & Numbers:** Fraunces (serif, display font) - used for large numbers, titles, logo
- **Body Text:** Outfit (sans-serif) - clean, modern for UI text
- **Chinese Text:** LXGW WenKai (handwritten-style Chinese font) - only applied to Chinese characters via unicode-range, while numbers stay in original fonts

**Font Weights:**
- Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

## Layout Structure

### **Bento Grid System**
The dashboard uses a responsive "bento box" grid layout:
- **Mobile:** Single column, stacked cards
- **Tablet (md):** 2 columns
- **Desktop (lg):** 3 columns

Cards use the `.bento-card` class:
```css
- Rounded corners: 24px (rounded-3xl)
- White background
- Soft shadow: subtle double-layer shadow
- Border: Light latte color with 50% opacity
- Hover effect: Glow shadow + honey-colored border
- Padding: 24px (p-6)
```

### **Component Hierarchy**

#### **1. Header (Sticky)**
- **Position:** Sticky top (z-index: 40)
- **Background:** Semi-transparent with backdrop blur
- **Height:** 64px mobile, 80px desktop
- **Layout:**
  - Left: Coffee cup logo + "Fika" text (Fraunces font)
  - Right: Add Transaction button + Settings icon + User avatar menu
- **Add Transaction Button:** Special 3D button with bottom border effect, uppercase text
- **User Avatar:** Circular, espresso background, shows first letter of name

#### **2. Welcome Section**
- Greeting text: "Good morning/afternoon/evening, [Name] ☕"
- Current month overview subtitle
- Personalized with user's first name

#### **3. Dashboard Grid**

**Row 1: Statistics Cards (3 columns)**

**Card 1 - Personal Equity:**
- Icon: TrendingUp in latte background circle
- Title toggles: "All-time Balance" / "Monthly Change"
- Large display number (font-display, 2xl-3xl)
- Top-right: Pill-shaped toggle for view mode
- Bottom: Secondary info (Total Assets if has excluded accounts)

**Card 2 - Monthly Income:**
- Icon: ArrowUpCircle in sage/green background
- Amount in sage green color
- Trend indicator: Percentage change with up/down arrow
- "vs same period last month" label

**Card 3 - Monthly Expenses:**
- Icon: ShoppingBag in berry/red background
- Amount in berry red color
- Trend indicator: Percentage change with up/down arrow

**Row 1.5: Subscriptions Card**
- Icon: RefreshCw (rotating arrows) in berry background
- Shows count of active subscriptions
- Large annual total in berry color
- Monthly average below
- Next payment alert box (color-coded by urgency):
  - Overdue: Berry background
  - Due soon (≤3 days): Honey background
  - Normal: Latte background

**Row 2: Account Selector (Full Width)**
- Horizontal scrollable chips for accounts
- Active account has honey border + honey background
- Each chip shows account icon with colored background

**Row 3: Spending Chart (Full Width)**
- Title: "Spending Trends"
- Time range pills: 7d, 14d, 30d, 90d
- Dual-line chart (income: sage, expense: berry)
- Clickable legend to show/hide lines
- Net summary stat
- Custom tooltip on hover
- Recharts library with custom styling
- Grid lines: Light caramel, horizontal only
- Axis labels: Cinnamon color

**Row 4: Category Breakdown (2 columns)**

Left: **Expense Breakdown**
- Donut chart with colored segments
- Center label shows total
- Legend grid (2 columns) with category icons
- Icons in colored circular backgrounds

Right: **Income Breakdown**
- Same donut chart layout as expenses
- Uses income categories

**Row 5: Personal Equity Trend (Full Width)**
- Area chart showing equity over time
- Similar styling to spending chart

**Row 6: Transaction History (Full Width)**
- Header with search bar and filter pills (All/Income/Expense)
- Edit mode toggle button
- Each transaction row:
  - Category icon in colored circle
  - Transaction name + note + account
  - Currency flag icon (circle-us.svg / circle-cn.svg)
  - Amount (green for income, red for expense)
  - Relative date ("Today", "2 days ago")
- Edit mode features:
  - Animated checkbox appearance
  - Row selection with shift-click for range
  - Batch delete functionality
  - Edit/Delete buttons per row
- "View all" button if >10 transactions

### **4. Modals**

**Base Modal Styling:**
- **Mobile:** Bottom sheet (rounded top only)
- **Desktop:** Centered dialog (rounded all sides, max-width: 512px)
- **Backdrop:** Dark mocha with blur
- **Animation:** Scale-in effect
- **Max height:** 85vh mobile, 90vh desktop
- **Scrollable content area**

**Transaction Modal:**
- **Layout:**
  - Mobile: Single column
  - Desktop: Two-column grid for large modals
- **Type Toggle:** Segmented control (Income/Expense) with icons
- **Amount Input:** Large display with currency symbol, calculator icon
  - Opens calculator keypad modal
- **Category Selection:**
  - Mobile: Horizontal scroll
  - Desktop: 4-column grid
  - Each category: Icon + name, honey border when active
- **Account Selection:** Same layout as categories
- **Date/Note:** Side-by-side on mobile
- **Currency Selection:** Flag icons with country badges
- **Timezone:** Collapsible dropdown
- **Continuous Entry Toggle:** iOS-style toggle switch (honey when active)
- **Save Toast:** Green success notification at bottom

**Settings Modal:**
- User profile info
- Currency preference toggle
- Language selector
- Timezone selector
- Account management

### **5. Authentication Pages**

**Layout:**
- Centered card on off-white background
- Coffee cup logo at top
- Card with bento-card styling
- Google OAuth button with multi-color Google logo
- Divider: "Or sign in with email"
- Email/password form with icon prefixes
- Eye icon for password visibility toggle
- Primary button: Full width, espresso background
- Link to signup/login (honey color)

## UI Component Patterns

### **Buttons**

**Primary (.btn-primary):**
- Background: Espresso
- Text: Cream
- Rounded: 16px (rounded-2xl)
- Padding: 12px 24px
- Hover: Mocha background + shadow
- Active: Scale 0.98

**Secondary (.btn-secondary):**
- Background: Latte
- Text: Espresso
- Same rounding and padding

**Ghost (.btn-ghost):**
- Transparent background
- Cinnamon text
- Hover: Latte background

**Add Transaction Button (.btn-add-transaction):**
- Unique 3D effect with bottom border
- Uppercase text with letter-spacing
- Active state: Pushes down

### **Input Fields (.input-field)**

- Border: 2px latte color
- Rounded: 12-16px
- Padding: 12-16px
- Focus: Honey border + honey ring (4px, 10% opacity)
- Placeholder: Cinnamon 60% opacity
- Icon prefix support (absolute positioning)

### **Badges**

**Income Badge:**
- Sage background 20% opacity
- Sage text
- Rounded-full

**Expense Badge:**
- Berry background 20% opacity
- Berry text

**Account Chips:**
- Active: Honey border + honey background 10%
- Inactive: Latte border, hover to caramel

### **Icons**

- Custom Icon component using Lucide React
- Size variants: 12px, 14px, 16px, 18px, 20px, 24px
- Color-coded by context
- Rounded backgrounds with 15-20% opacity

### **Custom Scrollbars**

- Width: 8px
- Track: Latte 50% opacity, rounded
- Thumb: Caramel, rounded, hover to cinnamon

## Animations & Transitions

**Standard Animations:**
- **fade-in:** 0.5s ease-out (opacity 0 → 1)
- **slide-up:** 0.5s ease-out (translate + opacity)
- **scale-in:** 0.3s ease-out (scale 0.95 → 1)

**Stagger Delays:**
- animate-delay-100 through animate-delay-500 (100ms increments)
- Applied to dashboard cards for sequential appearance

**Transition Durations:**
- Standard: 300ms
- All transitions use `ease` or `ease-out` timing

**Hover Effects:**
- Cards: Glow shadow + border color change
- Buttons: Background color + shadow
- Scale effects: 0.98 on active state

## Responsive Breakpoints

- **sm:** 640px (small tablets)
- **md:** 768px (tablets)
- **lg:** 1024px (desktops)
- **xl:** 1280px (large desktops)

**Mobile-First Patterns:**
- Text sizes scale up (text-sm → text-base)
- Padding increases (p-4 → p-6)
- Single column → multi-column grids
- Bottom sheets → centered modals
- Horizontal scroll → grid layouts

## Unique Design Details

1. **Coffee Cup Logo:** Custom SVG with steam wisps, cup handle, and liquid surface ellipse
2. **Number Display:** Always uses Fraunces font in Chinese mode to keep numbers readable
3. **Timezone Indicator:** Small globe icon with collapsible selector
4. **Currency Flags:** Circle flag SVGs (circle-us.svg, circle-cn.svg)
5. **External Account Badge:** Small red pill badge for excluded accounts
6. **Saved Toast:** Appears at bottom-center with check icon
7. **Calculator Keypad:** Full modal with numeric grid layout
8. **Selection Mode:** Smooth width transition for checkboxes (0 → 20px)
9. **Range Selection:** Shift-click support with user-select: none
10. **Empty States:** Centered icons in latte circles with helpful messages

## Visual Hierarchy

**Text Sizes:**
- **Heading 1:** text-3xl (30px)
- **Heading 2:** text-2xl (24px)
- **Heading 3:** text-lg (18px)
- **Stat Values:** text-2xl to text-3xl
- **Body:** text-sm to text-base (14-16px)
- **Small:** text-xs (12px)
- **Tiny:** text-[10px]

**Spacing System:**
- Base unit: 4px (0.25rem)
- Common gaps: 8px, 12px, 16px, 24px
- Card padding: 16px mobile, 24px desktop
- Grid gaps: 16px mobile, 24px desktop

## Accessibility Considerations

- Focus rings on interactive elements (honey color, 4px)
- ARIA labels on icon-only buttons
- Keyboard navigation (Escape closes modals)
- Relative date formatting
- High contrast between text and backgrounds
- Large touch targets on mobile (minimum 44px)

## Current Design Strengths

✅ Cohesive color palette with clear semantic meaning
✅ Consistent spacing and border radius
✅ Smooth animations and transitions
✅ Responsive across all screen sizes
✅ Clear visual hierarchy
✅ Friendly, approachable aesthetic
✅ Good use of white space
✅ Icon + color coding for quick recognition

---

This comprehensive overview should provide your expert with all the visual and structural details needed to understand the current design and propose meaningful improvements.
