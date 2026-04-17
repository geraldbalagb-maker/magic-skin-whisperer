# Project Memory

## Core
Maison 22 Esthétique brand: Premium, Karla font (fallback Arial, Helvetica), Amber (#C8944A), Black, White, Gold.
Main flow is at `/` (landing → quiz → analysis → results → thankyou). Legacy landing at `/v1`.
Supabase Edge Functions backend. Gemini for AI features. WooCommerce REST API v3 integration.
UI: GlassMorphism (bg-white/95), elegant shadows, no cart icon in headers.
No decorative emoji anywhere in the app — luxury minimal style.

## Memories
- [Brand Design System](mem://style/brand-design-system) — Maison 22 Esthétique premium design tokens, typography, and UI styling
- [V1 Landing Layout](mem://style/v1-landing-layout) — Layout details for the legacy V1 landing page at /v1
- [Landing Page (v2)](mem://features/landing-v2) — Main landing page layout extending Luxury Perfumes e-commerce
- [Onboarding Quiz](mem://features/onboarding-quiz) — AI chatbot-style interactive onboarding quiz flow and UI details
- [Analysis Loading](mem://features/analysis-loading) — AI scan loading screen with 5-step timeline and selfie preview
- [Results Page](mem://features/results-page) — Editorial results page layout with Bento Grid, custom routine, and alternatives
- [Before/After Filter](mem://features/before-after-filter) — Interactive slider for AI skin enhancement comparison on selfie
- [Referral System](mem://features/referral-system) — Post-purchase gift box interaction unlocking email referral form
- [Thank You Celebration](mem://features/thank-you-celebration) — Post-referral celebration screen with free product offer
- [Cloud Backend](mem://tech/cloud-backend) — Supabase Edge Functions, Gemini AI integration, and WooCommerce setup
- [Product Catalog](mem://tech/product-catalog) — 30 Maison 22 Esthétique products mapped in KB for AI recommendations
- [WooCommerce Integration](mem://tech/woocommerce-integration-option-b) — Order creation via Edge Function and redirection to WC payment URL
- [AI Selfie Enhancement Prompt](mem://tech/ai-selfie-enhancement-prompt) — Strict rules for Gemini AI selfie processing to preserve identity
