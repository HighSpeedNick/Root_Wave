# Rootwave evaluation

This document summarizes the reproducible evaluation of Rootwave's local text and voice pipeline. The app supports English, French and German. All inference in these tests uses the same on-device models and decision rules as the product.

## What is evaluated

Rootwave turns a visitor request into one fixed tourism category, or returns **Not sure** when the evidence is too weak or two categories are too close.

The evaluation measures three separate things:

- **Text classification:** category selection from the original typed message.
- **Speech recognition:** word error rate (WER) between the spoken reference and the local transcript. Lower is better.
- **End-to-end audio classification:** category selection after local speech recognition, including **Not sure** outcomes.

**Accuracy when answered** excludes **Not sure** cases and asks: when Rootwave did return a category, how often was it correct?

## Evaluation data

### Calibration bench

The calibration bench contains 21 aligned requests in each language: 63 inputs total. It is used to inspect category confusions and suggest thresholds. It is not used as classifier prototypes.

At the current shared thresholds (`minScore 0.84`, `minMargin 0.012`), the calibration bench produced:

| Language | Correct | Wrong | Not sure | Top-1 without guardrail |
|---|---:|---:|---:|---:|
| English | 57% | 5% | 38% | 86% |
| French | 57% | 5% | 38% | 76% |
| German | 48% | 14% | 38% | 76% |
| **Overall** | **54%** | **8%** | **38%** | **79%** |

These results are for threshold calibration, not the final performance claim. Full output: [`../bench/RESULTS.md`](../bench/RESULTS.md).

### Held-out reporting set

The separate reporting set contains 45 messages: 15 each in English, French and German, including three off-topic messages per language. It is never used as a prototype source or for threshold tuning.

## Text results

| Language | Correct | Wrong | Not sure | Accuracy when answered | Top-1 without guardrail |
|---|---:|---:|---:|---:|---:|
| English | 80% | 7% | 13% | 92% | 87% |
| French | 60% | 0% | 40% | 100% | 93% |
| German | 80% | 7% | 13% | 92% | 93% |
| **Overall** | **73%** | **4%** | **22%** | **94%** | **91%** |

The most defensible summary is: **on this 45-message held-out set, Rootwave returned a category for 78% of messages, and 94% of those answers were correct.** This is not a claim of 94% accuracy on all real visitor requests.

Full output: [`../bench/TEST-RESULTS.md`](../bench/TEST-RESULTS.md).

## Audio method

Each of the 45 held-out messages was synthesized in two voices, producing 90 clips per condition. The test used:

- one feminine and one masculine synthetic voice;
- the same local Whisper-tiny q8 speech model used by the app;
- the visitor's selected language as the speech-recognition language hint;
- the same multilingual text classifier and thresholds used for typed input;
- a clean condition and a deterministic white-noise condition at 10 dB signal-to-noise ratio.

The cloud voice service is used only by the developer script to create test recordings. It is not part of the app or its runtime pipeline.

## Audio results

### Clean synthetic speech

| Language | WER | Correct | Wrong | Not sure | Accuracy when answered | Same label as typed |
|---|---:|---:|---:|---:|---:|---:|
| English | 3% | 80% | 7% | 13% | 92% | 100% |
| French | 26% | 50% | 0% | 50% | 100% | 83% |
| German | 20% | 67% | 7% | 27% | 91% | 87% |
| **Overall** | **16%** | **66%** | **4%** | **30%** | **94%** | **90%** |

### Synthetic speech with 10 dB noise

| Language | WER | Correct | Wrong | Not sure | Accuracy when answered | Same label as typed |
|---|---:|---:|---:|---:|---:|---:|
| English | 28% | 73% | 10% | 17% | 88% | 93% |
| French | 67% | 13% | 13% | 73% | 50% | 43% |
| German | 44% | 67% | 10% | 23% | 87% | 73% |
| **Overall** | **46%** | **51%** | **11%** | **38%** | **82%** | **70%** |

The clean clips retained the typed-input label 90% of the time. Noise reduced that to 70%. French speech recognition is the clearest weakness in this test, especially with noise.

Full output, including the worst clean transcripts: [`../bench/AUDIO-RESULTS.md`](../bench/AUDIO-RESULTS.md).

## ElevenLabs voice evaluation

A second reproducible audio run generated exactly 45 clips with ElevenLabs: the same 15 untouched messages in each of English, French and German. Generation used the `eleven_multilingual_v2` model, Sarah voice, speed 1.0, stability 0.5, similarity boost 0.75, speaker boost enabled and 24 kHz mono PCM. The files were then processed by Rootwave's local Whisper-tiny q8 model and unchanged classifier.

### ElevenLabs clean speech

| Language | WER | Correct | Wrong | Not sure | Accuracy when answered | Same label as typed |
|---|---:|---:|---:|---:|---:|---:|
| English | 5% | 80% | 7% | 13% | 92% | 100% |
| French | 26% | 53% | 0% | 47% | 100% | 87% |
| German | 19% | 73% | 7% | 20% | 92% | 93% |
| **Overall** | **17%** | **69%** | **4%** | **27%** | **94%** | **93%** |

Rootwave answered 33 of 45 clean clips and correctly classified 31. Therefore, **accuracy when answered was 94%, with a 95% Wilson confidence interval of 80–98%**. Overall end-to-end correctness, counting **Not sure** as not correct, was 69%.

### ElevenLabs speech with 10 dB noise

| Language | WER | Correct | Wrong | Not sure | Accuracy when answered | Same label as typed |
|---|---:|---:|---:|---:|---:|---:|
| English | 14% | 80% | 7% | 13% | 92% | 100% |
| French | 425% | 13% | 7% | 80% | 67% | 40% |
| German | 35% | 40% | 0% | 60% | 100% | 53% |
| **Overall** | **161%** | **44%** | **4%** | **51%** | **91%** | **64%** |

Rootwave answered 22 of 45 noisy clips and correctly classified 20. Accuracy when answered was 91%, with a 95% Wilson confidence interval of 72–97%, but coverage fell to 49%. WER can exceed 100% when the recognizer inserts more words than the reference contains; the 425% French result reflects severe hallucinated transcription under this artificial noise condition.

These figures are verifiable results for this exact synthetic corpus, not a guarantee of real-world accuracy. Full generated report: [`../bench/ELEVENLABS-AUDIO-RESULTS.md`](../bench/ELEVENLABS-AUDIO-RESULTS.md).

## Interpretation and limitations

- The held-out set is small: 45 messages and 90 synthetic recordings per audio condition.
- Synthetic voices are clearer and more consistent than real visitors, so the audio numbers are best-case laboratory results.
- The noise condition uses generated white noise, not recordings from farms, roads, cafés or crowds.
- The set does not cover accents, code-switching, slang, children, overlapping speakers or device-microphone differences.
- Percentages are rounded to whole numbers, so small changes represent very few examples.
- **Not sure** is intentional. It reduces guessing but also lowers the share of requests receiving a category.
- Text and audio should be validated next with consented real recordings from the intended devices and environments.

## Reproduce the evaluation

Install the project dependencies, then run:

```bash
# Calibration bench
bun scripts/bench.ts --out=bench/RESULTS.md

# Separate held-out text set
bun scripts/bench.ts --set=test --out=bench/TEST-RESULTS.md

# Generate spoken clips once (requires LOVABLE_API_KEY)
bun scripts/make-audio-clips.ts

# Run local speech recognition and end-to-end classification
bun scripts/audio-bench.ts --out=bench/AUDIO-RESULTS.md

# Generate the 45 ElevenLabs clips once (requires ELEVENLABS_API_KEY)
bun run eval:elevenlabs:generate

# Score those clips and write the report
bun run eval:elevenlabs
```

The generated audio defaults to `/tmp/hs-audio`, and downloaded evaluation models default to `/tmp/hs-bench-cache`. Set `AUDIO_DIR` or `BENCH_CACHE` to override those locations.

The ElevenLabs clips default to `/tmp/hs-elevenlabs-audio`. Existing files are reused, preventing accidental repeat credit use. Delete that directory only when intentionally regenerating the corpus. For a different fixed ElevenLabs voice, set both `ELEVENLABS_VOICE_ID` and `ELEVENLABS_VOICE_NAME`, then pass the same name in `AUDIO_VOICES` when scoring.

### Recommended real-speaker verification

Synthetic speech alone cannot establish field accuracy. For a stronger claim, collect consented recordings from at least five speakers per language on the intended phone or tablet, covering quiet and realistic farm noise. Keep the 45 sentences and expected labels fixed, save clips as `<test-index>-<voice-name>.wav`, list the voice names in `AUDIO_VOICES`, and run the same evaluator. Report sample counts and 95% confidence intervals; do not select only successful recordings or tune thresholds on this set.

## Evaluation safeguards

- `src/lib/test-set.ts` remains separate from the prototype examples and calibration data.
- The held-out set must not be used to tune thresholds.
- `src/lib/massive-examples.ts` is generated from attributed Amazon MASSIVE 1.1 data and is not hand-edited.
- Any classifier change should be measured on the calibration bench first, then reported once on the untouched held-out set.
