# Current work
- [x] Connect ME-22 recommendations to results, preserving morning/evening/weekly steps.
- [x] Keep selected products, bundle totals and checkout payload aligned using engine WooCommerce IDs.
- [x] Test real selfie → engine → results and selection flow; six adapter tests passed.
- [x] Correct the €100 quiz mapping to ME-22 low/low_end and share cent-rounded final bundle pricing with budget validation; 10 tests passed and real photo flow showed €106.80 → €96.12 without a false overrun.
- [x] Budgets now 100/250/350€ → low/medium/high with 15% tolerance; €50 option removed.
- [x] Photo analysed by ME-22 right after upload; concerns and description pre-filled and editable; full payload sent to /v1/routines.
- [x] Before/after follows photo ratio; smaller step images; tips labelled by engine source; cart call shown on screen.
- [ ] Connect the ME-22 cart to the live WooCommerce cart and verify the payment handoff: blocked by the store's missing Maison 22 cart handler (`/m22-cart` returns 404; `/carrello/` is live). The IT team must install/activate the handler and configure the matching shared secret before a real multi-product checkout can be verified. No payment was tested.