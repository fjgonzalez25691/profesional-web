# Analytics & Tracking Guide

## Overview
This project implements a minimal viable instrumentation for conversion tracking, focusing on CTA clicks and Calendly bookings.
The implementation relies on `Google Analytics 4 (GA4)` via `gtag.js`.

## Event Structure
All events automatically include:
- `timestamp`: ISO 8601 timestamp
- `pathname`: Current page path (e.g., `/`, `/case/cloud-costs`)

### Core Events

#### 1. `cta_calendly_click`
Triggered when a user clicks on a "Call to Action" button that opens the Calendly modal.

**Properties:**
- `cta_id`: Identifier of the button (e.g., `'hero'`, `'floating'`)
- `method`: (Optional) Interaction method (e.g., `'click'`, `'keyboard'`)

**Example:**
```json
{
  "event": "cta_calendly_click",
  "cta_id": "hero",
  "pathname": "/",
  "timestamp": "2025-12-03T10:00:00.000Z"
}
```

#### 2. `calendly_booking_completed`
Triggered when a user successfully completes a booking within the Calendly widget.

**Properties:**
- `source`: Origin of the modal opening (e.g., `'hero'`, `'fab'`)

**Example:**
```json
{
  "event": "calendly_booking_completed",
  "source": "hero",
  "pathname": "/",
  "timestamp": "2025-12-03T10:05:00.000Z"
}
```

#### 3. `calendly_modal_open` / `calendly_modal_close`
Triggered when the scheduling modal is opened or closed.

**Properties:**
- `source`: Origin of the modal (e.g., `'hero'`, `'fab'`)

## Implementation Details

### `useAnalytics` Hook
Use this hook in client components to track events. It automatically injects the `pathname`.

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export function MyComponent() {
  const { track } = useAnalytics();

  const handleClick = () => {
    track('cta_calendly_click', { cta_id: 'my-button' });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Production vs Development
- **Development**: Events are logged to the browser console with prefix `[Analytics]`.
- **Production**: Events are sent to Google Analytics (`window.gtag`) if `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.

### Privacy & PII
- **NO** Personally Identifiable Information (PII) is tracked (email, name, phone).
- Calendly event URIs are excluded to prevent potential PII leakage.
