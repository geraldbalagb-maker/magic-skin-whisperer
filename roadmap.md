# Current work
- [x] Connect ME-22 recommendations to results, preserving morning/evening/weekly steps.
- [x] Keep selected products, bundle totals and checkout payload aligned using engine WooCommerce IDs.
- [x] Test real selfie → engine → results and selection flow; six adapter tests passed.
- [x] Correct the €100 quiz mapping to ME-22 low/low_end and share cent-rounded final bundle pricing with budget validation; 10 tests passed and real photo flow showed €106.80 → €96.12 without a false overrun.
- [ ] Support a strict €50 engine budget and remove the external engine's 15% tolerance for strict caps: blocked by the external ME-22 API, which accepts only low/medium/high and starts at €100. Genuine overruns remain visible.
- [ ] Connect the ME-22 cart to the live WooCommerce cart and verify the payment handoff: blocked by the store's missing Maison 22 cart handler (`/m22-cart` returns 404; `/carrello/` is live). The IT team must install/activate the handler and configure the matching shared secret before a real multi-product checkout can be verified. No payment was tested.