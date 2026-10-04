# Separate test set

Prototypes: **all** (159 examples). Test set: 45 held-out messages (EN/FR/DE incl. off-topic), never used for tuning.

Accuracy = correct among answered messages; "Not sure" = share withheld by the rule.

## With current defaults (minScore 0.84, minMargin 0.012)

| Lang | Correct | Wrong | Not sure | Accuracy when answered | Top-1 (no rule) |
|---|---|---|---|---|---|
| en | 80% | 7% | 13% | 92% | 87% |
| fr | 60% | 0% | 40% | 100% | 93% |
| de | 80% | 7% | 13% | 92% | 93% |
| all | 73% | 4% | 22% | 94% | 91% |

## Suggested thresholds per language (wrong ≤ 5%)

| Lang | minScore | minMargin | Correct | Wrong |
|---|---|---|---|---|
| en | 0.8 | 0.02 | 87% | 0% |
| fr | 0.8 | 0.012 | 67% | 0% |
| de | 0.8 | 0.028 | 67% | 0% |

## Confusions (top-1, ignoring the not-sure rule)

- en: expected harvest_walk, got transport (0.861, margin 0.019)
- en: expected prices, got coffee_tasting (0.843, margin 0.000)
- fr: expected prices, got coffee_tasting (0.889, margin 0.012)
- de: expected prices, got coffee_tasting (0.862, margin 0.026)
