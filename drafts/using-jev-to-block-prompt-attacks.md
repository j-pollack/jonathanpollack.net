---
layout: ../../layouts/Post.astro
title: "Using Jev to block prompt attacks: judge the trick, not the request"
date: "2026-10-27"
description: A cheap, explainable guard that asks a small model 36 yes/no questions about every input
---
I built a guard that sits in front of an LLM and blocks prompt injection and jailbreaks. It doesn't use a fine-tuned classifier. Instead it asks a small, cheap model (TypeSafe's Jev) 36 plain-English yes/no questions about each input, things like "does this tell the AI to ignore its instructions?" or "is the request hidden in an encoding?", and a logistic regression turns the answers into a score.

Why bother doing it this way? Every decision comes with the list of questions that fired, so you can actually see *why* something got blocked. And if a question is wrong, you just change the question. No retraining.

## The one rule

The guard looks at *how* an input tries to manipulate the model, never at *what* it asks for. Whether a request should be answered is the model's job (and its provider's). The guard's job is to stop text that tries to take that decision away from the model.

To keep myself honest, I lined the definition up with NIST's attack taxonomy[^1] and kept only the techniques you can actually see in the text.

## How did it do?

- **Held-out benchmarks** (4,129 items from 25 public datasets): blocks 92.9% of attacks, wrongly blocks 5.5% of non-attacks.
- **Real chat traffic**: wrongly blocks 0.23% of WildChat and 0.84% of LMSYS-Chat first messages.
- **Attacks that actually work**: I replayed a sample of attacks against nine production models. The guard blocks 86–93% of the ones that succeed, and cuts overall attack success from 9.5% to 1.4%.
- **Against Meta's Llama Prompt Guard 2 (86M)** on the same data: AUC 0.985 vs 0.846. Prompt Guard misses almost all indirect injection (instructions planted in tool output) and encoded attacks. To be fair to it though, it's free and runs locally in milliseconds, and that's a real advantage.

The whole project, including labeling, grading, and replays against nine models, cost about $94 in API calls.

## What I learned

**The definition matters more than the model.** Benchmarks don't agree on what an attack even is. Is a role-play setup asking for something harmful an attack? Depending on how you answer, the same guard's catch rate moves by thirty points. A recall number without the definition behind it doesn't tell you much.

**Check whether the misses work.** The attacks my guard missed were almost twice as likely to succeed as the ones it blocked (16% vs 9%). Recall over all attacks makes a guard look better than it is.

**Put harmful requests in your negatives.** If plain harmful requests aren't labeled "not an attack", the model learns that harmful means attack, and what you've built is a harm detector with a jailbreak label slapped on it.

**Grade against the original request.** A grader that saw a softened, rewritten prompt counted answers to the softer version as wins, and overstated jailbreak success by more than 2×.

**Benchmark false positives aren't production false positives.** Benchmarks are built to be hard: 5.5% there, under 1% on real traffic. And when I went after false positives, rewording questions did nothing measurable. What did work was adding 778 real, labeled chat messages to training, which cut them in half.

The code, data pipeline, and paper are all up at [github.com/j-pollack/technique-guard](https://github.com/j-pollack/technique-guard).

---
[^1]: NIST AI 100-2, Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations (https://csrc.nist.gov/pubs/ai/100/2/e2025/final)
