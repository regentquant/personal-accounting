# UI/UX Improvement Task: Fika Dashboard Responsive Layout

**Context:**
We are optimizing the responsive layout for the "Fika" financial dashboard. Currently, the layout struggles with whitespace management on wide screens and logical grouping on mid-sized screens.

**Current Issues:**
1.  **Wide Screen:** The "Personal Equity" card is too tall and narrow, leaving dead space below the "Monthly Expenses" card. The vertical orientation is poor for the chart visualization.
2.  **Mid Screen:** "Monthly Income" and "Monthly Expenses" are separated on different rows. These are peer metrics and must be adjacent for comparison.

**Objective:**
Refactor the grid system to utilize a "Bento Grid" approach that dynamically adjusts card aspect ratios based on screen width.

## Proposed Layout Specifications

### 1. Mid-Screen / Laptop View (approx 1024px - 1300px)
*Logic: Prioritize vertical scrolling over horizontal cramping.*

* **Row 1 (Top):** **Personal Equity**
    * **Span:** Full Width (100%).
    * **Reasoning:** Giving this card full width allows the chart (time-series) to expand horizontally, making the data easier to read than the current square/vertical block.
* **Row 2 (Middle):** **Income & Expenses**
    * **Span:** Split 50% / 50% side-by-side.
    * **Reasoning:** Keeps comparative financial flow data adjacent.
* **Row 3 (Bottom):** **Subscriptions**
    * **Span:** Full Width (100%) or share with a future "Savings Goals" card.

### 2. Wide Screen View (1440px +)
*Logic: Maximize data density and eliminate trapped whitespace.*

**Option A (The 3-Column Balanced Grid):**
* **Column 1:** **Personal Equity** (Tall).
    * *Modification:* Only keep this vertical if the chart is changed to a list or a vertical bar gauge. If it remains a line chart, use Option B.
* **Column 2:** **Income** (Top) and **Expenses** (Bottom).
    * Stack these vertically. This fills the height to match Column 1.
* **Column 3:** **Subscriptions**.
    * Stretches to match the height of Col 1 and Col 2.

**Option B (The "Dashboard Header" - Recommended):**
* **Row 1:** **Personal Equity**
    * Span: 66% width (Left).
    * Height: Fixed height (e.g., 400px).
* **Row 1 (Right):** **Income & Expenses**
    * Stack them vertically in the remaining 33% width.
    * Income on top, Expenses on bottom.
* **Row 2:** **Subscriptions**
    * Span: Full Width or Grid Masonry flow.

## Technical Implementation Notes (CSS/Grid)

* **Container:** Use CSS Grid.
* **Gap:** Maintain the current `24px` (approx) gutter.
* **Card Consistency:** Ensure `border-radius` and padding remain consistent across resize events.
* **Visual Balance:** In the Mid-screen view, ensure the height of the "Income" and "Expense" cards match perfectly.

## Summary of Changes
1.  **Group Income/Expense:** Force these elements to always wrap together. They should never be separated by another element.
2.  **Chart Aspect Ratio:** Prioritize horizontal width for the "Personal Equity" card to better support the visualization of financial trends.