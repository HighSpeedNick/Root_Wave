# Classifier test bench

Prototypes: **all** (159 examples). Bench: 21 aligned sentences × 3 languages.

## With current defaults (minScore 0.84, minMargin 0.012)

| Lang | Correct | Wrong | Not sure | Top-1 (no rule) |
|---|---|---|---|---|
| en | 57% | 5% | 38% | 86% |
| fr | 57% | 5% | 38% | 76% |
| de | 48% | 14% | 38% | 76% |
| all | 54% | 8% | 38% | 79% |

## Suggested thresholds per language (wrong ≤ 5%)

| Lang | minScore | minMargin | Correct | Wrong |
|---|---|---|---|---|
| en | 0.8 | 0.012 | 71% | 5% |
| fr | 0.8 | 0.01 | 62% | 5% |
| de | 0.8 | 0.018 | 29% | 5% |

## Confusions (top-1, ignoring the not-sure rule)

- en: expected harvest_walk, got coffee_tasting (0.872, margin 0.000)
- en: expected coffee_tasting, got roasting (0.861, margin 0.011)
- en: expected coffee_tasting, got roasting (0.886, margin 0.012)
- fr: expected harvest_walk, got coffee_tasting (0.930, margin 0.010)
- fr: expected harvest_walk, got roasting (0.892, margin 0.000)
- fr: expected coffee_tasting, got roasting (0.902, margin 0.009)
- fr: expected coffee_tasting, got roasting (0.900, margin 0.013)
- fr: expected other, got transport (0.857, margin 0.008)
- de: expected harvest_walk, got coffee_tasting (0.913, margin 0.017)
- de: expected harvest_walk, got roasting (0.893, margin 0.013)
- de: expected coffee_tasting, got roasting (0.865, margin 0.022)
- de: expected coffee_tasting, got roasting (0.875, margin 0.003)
- de: expected other, got transport (0.824, margin 0.002)
