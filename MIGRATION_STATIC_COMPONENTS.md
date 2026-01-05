# Migration: Static Components (Hardcoded Configuration)

## Overview
This migration converts database-driven content management for specific sections to static hardcoded HTML/CSS, removing unnecessary database queries and admin panel management for these components.

## Sections Migrated to Static Content

### 1. Kim Uchun Section (For Whom Section)
**Previous Implementation:** Database-driven via `site_settings` table with 13 configuration keys
**New Implementation:** Static component `/src/components/KimUchunSection.tsx`

#### Removed Database Fields
```sql
kim_uchun_title
kim_uchun_title_align
kim_uchun_title_size
kim_uchun_card1_text
kim_uchun_card1_icon
kim_uchun_card2_text
kim_uchun_card2_icon
kim_uchun_card3_text
kim_uchun_card3_icon
kim_uchun_card_text_size
kim_uchun_button_text
kim_uchun_button_align
kim_uchun_button_text_size
```

#### Migrated Content (Hardcoded)
- **Title:** "BU TAKLIF AYNAN SIZ UCHUN, AGAR SIZ:" (36px, centered, #0066CC)
- **Card 1:** "Tishlaringiz sarg'ayib, tabassumingizdan uyaladigan bo'lsangiz" (Frown icon, 16px)
- **Card 2:** "Og'zingizda noxush hid sezilib, odamlar bilan bemalol gaplasha olmasangiz" (Wind icon, 16px)
- **Card 3:** "Tish shifokoriga borishdan qo'rqib, uzoq vaqt tashrifni kechiktirib kelgan bo'lsangiz" (AlertCircle icon, 16px)
- **Button:** "Bu men uchun" (20px, centered, #0066CC background)

#### Removed Admin Components
- `/src/components/admin/KimUchunManagement.tsx` (383 lines)
  - Removed from Admin Panel tab: "Kim Uchun Bo'limi"

#### Styling Notes
- Cards have hover effects (scale 1.05, shadow)
- Responsive grid layout: 1 column on mobile, 3 columns on desktop
- Icon backgrounds use primary color with 15% opacity
- Button has hover opacity effect (90%)

### 2. Floating Contact Buttons
**Previous Implementation:** Database-driven via `contact_buttons` table + global setting
**New Implementation:** Static component `/src/components/FloatingContactButtonsStatic.tsx`

#### Removed Database Data
```sql
contact_buttons table entries:
- Telegram: "Telegramdan xabar yuborish" → https://t.me/meddentuz
- Phone: "Qo'ng'iroq qilish" → +998781502152
```

#### Hardcoded Button Configuration
```typescript
{
  type: 'telegram',
  label: 'Telegramdan xabar yuborish',
  value: 'https://t.me/meddentuz',
}
{
  type: 'phone',
  label: 'Qo\'ng\'iroq qilish',
  value: '+998781502152',
}
```

#### Features Preserved
- Expandable menu on scroll < 300px
- Scroll-to-top arrow on scroll > 300px
- Phone call trigger via `tel:` protocol
- Telegram link opens in new tab
- Smooth animations and hover states
- Fixed bottom-right positioning with z-50

#### Removed Admin Components
- `/src/components/admin/ContactButtonsManagement.tsx` (11 lines placeholder)
  - Removed from Admin Panel tab: "Aloqa Tugmalari"

### 3. Text Settings (Partial Removal)
**Note:** Hero section texts remain in admin panel for configuration. Only the following are preserved hardcoded in the new static components:
- Kim Uchun section titles and content (see above)
- Contact button labels (see above)

## File Changes

### New Files Created
```
/src/components/KimUchunSection.tsx           (134 lines)
/src/components/FloatingContactButtonsStatic.tsx (121 lines)
/src/pages/... (migration documentation)
```

### Files Modified
```
/src/pages/HomePage.tsx
  - Replaced: import FeatureBanners → import KimUchunSection
  - Replaced: import FloatingContactButtons → import FloatingContactButtonsStatic
  - Updated component usage in JSX

/src/pages/AdminPanel.tsx
  - Removed imports: ContactButtonsManagement, KimUchunManagement
  - Removed imports: Phone icon (unused)
  - Removed Tab types: 'contact-buttons', 'kim-uchun'
  - Removed tabs from navigation array
  - Removed component rendering logic for removed tabs
```

### Files No Longer Used
```
/src/components/FeatureBanners.tsx (200+ lines)
  - Replaced by KimUchunSection.tsx

/src/components/FloatingContactButtons.tsx (105 lines)
  - Replaced by FloatingContactButtonsStatic.tsx
```

## Database Impact

### Data Integrity
- No data deletion occurred
- Kim Uchun and contact button settings remain in database for potential future use
- Database schema unchanged - fields can be restored if needed

### Query Reduction
- Eliminated 2 database queries per page load
- Kim Uchun section: 13 settings queries → 0 queries
- Contact buttons: 3 queries (fetch buttons + global setting) → 0 queries

## Admin Panel Changes

### Removed Tabs
1. **"Aloqa Tugmalari"** (Contact Buttons Management)
   - Tab ID: 'contact-buttons'
   - Component: ContactButtonsManagement (was placeholder)

2. **"Kim Uchun Bo'limi"** (For Whom Section)
   - Tab ID: 'kim-uchun'
   - Component: KimUchunManagement

### Remaining Text Management
- **"Matnlar"** (TextSettings) - Hero section texts only
- **"Barcha Matnlar"** (AllTextsManagement) - Other section texts

## Styling & Responsive Design

### KimUchunSection Breakpoints
- **Mobile (<768px):** Single column layout, base font sizes
- **Tablet/Desktop (≥768px):** 3-column grid layout

### FloatingContactButtonsStatic Breakpoints
- **Mobile:** Full-width button menu, 56px main button
- **Desktop:** Same fixed positioning and sizing

### Color System (Hardcoded)
- Primary Color: `#0066CC` (used for titles, icons, buttons)
- Icon Background: Primary color with 15% opacity
- Text Color: Neutral-700 (#333 equivalent)

## Accessibility Notes

- All interactive elements retain proper hover states
- Button labels are descriptive
- Icons have semantic meaning
- Scroll-to-top functionality provides additional navigation
- Contact buttons use standard protocols (tel:, https://)

## Reverting Changes

If database-driven configuration is needed in future:
1. Uncomment/restore FeatureBanners.tsx usage
2. Uncomment/restore FloatingContactButtons.tsx usage
3. Re-add admin components to AdminPanel
4. Database fields remain in site_settings and contact_buttons tables

## Version Control
- Previous dynamic components archived in git history
- New static components provide clean code references
- Migration date: January 3, 2026
