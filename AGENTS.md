# Architecture rules
- ME-22 calls stay in Cloud functions; the browser consumes analysis, recommendation and preview job metadata from the proxy so engine credentials never reach the client.
- Adapt engine recommendations in a dedicated, tested client module; match catalog identity exactly and reject unresolved products instead of silently substituting recommendations.
- Results and checkout share the same resolved product collection; deduplicate repeated daily products before computing bundle totals.