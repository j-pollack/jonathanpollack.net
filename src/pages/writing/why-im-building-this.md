---
layout: ../../layouts/Post.astro
title: Why I’m doing this
date: "2026-10-01"
description: Demos of AI control problems, what they might teach us about auditing frontier labs, and why I want to make a coordinated slowdown technically feasible.
---

My current professional focus is helping get the world to a place where an internationally coordinated AI slowdown or pause is technically feasible. I want us to have a credible way to check that agreed limits are being followed, including when someone has an incentive to evade them.

There are political questions involved in getting to that point: which limits to set, who agrees to them, and who has the authority to enforce them. My work focuses on part of the technical problem. If countries agreed to pause certain training runs, what would it take to tell whether a lab was complying? What evidence would an auditor need? Could the monitoring process itself be fooled?

This website is a place to explore questions like these through demos and toy experiments. I’m hoping to build quite a few of them.

## AI control and lab auditing

In an AI control setup, we might give an agent tools and put a monitor in charge of checking its actions. The monitor has to distinguish legitimate work from attempts to do something prohibited. Its view may be incomplete, and the agent may be capable of finding ways around the checks.

I think many of the same difficulties show up when we try to automate auditing of frontier AI labs. An auditor needs to establish whether a rule was followed using the evidence available to it. A lab trying to evade that rule may understand how the audit works and choose what to hide, disclose, or make look routine.

The analogy has limits. A lab is an organization made up of people, with physical infrastructure, legal obligations, and incentives that a toy agent won’t capture. But I suspect there is useful overlap in the technical questions: what the overseer can observe, how it interprets what it sees, and whether it can intervene before a prohibited action happens.

That overlap is something I want to investigate. A small experiment gives us a way to isolate one difficulty, change the setup, and see whether a proposed control actually helps.

## What I hope comes out of this

I have two ambitions for these experiments.

First, I hope they make the problems concrete enough that more people choose to act. Working through an oversight problem yourself can give you a much more specific sense of the difficulty than reading a broad claim about it. That might lead someone to contribute an experiment, work on auditing tools, or press for regulation and the technical capacity to enforce it.

Second, I hope they can generate useful scientific insight. We may find control techniques that hold up under pressure, failure modes we hadn’t anticipated, or gaps between offensive and defensive capabilities that deserve more attention. Even a failed idea can be useful if the experiment makes clear why it failed.

A toy experiment leaves out much of what makes real oversight difficult. I want the writeups here to be explicit about those limits, so readers can judge what each result supports and what would need to be tested next.

The approach is to build demos, let people try to break them, and write down what we learn. The larger ambition is to help make international limits on AI development something we could actually verify and enforce.

The first experiment is [Plant the flag](/writing/plant-the-flag/), a challenge to get an agent past an AI monitor. Its companion essay explains the setup and the questions I want to explore with it.
