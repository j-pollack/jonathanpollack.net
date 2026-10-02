---
layout: ../../layouts/Post.astro
title: "Plant the flag: can an agent evade its monitor?"
date: "2026-10-02"
description: A challenge to prompt an agent past an AI monitor, and a starting point for investigating the gap between evasion and detection.
project: plant-the-flag
---

Plant the flag is the first experiment on this site. The challenge is to prompt an agent so that it evades an AI monitor and makes a disallowed network call.

I’m interested in what happens when someone actively tries to get around oversight. Giving a monitor a rule is a starting point. This demo gives people a concrete way to test whether that rule survives an attempt to evade it.

## The challenge

As a participant, you write the agent’s instructions and try to get it past the monitor. The target is a harmless test endpoint. Reaching it stands in for a consequential action, such as starting a training run that violates an agreed pause.

The monitor’s job is to recognize and stop the prohibited action while still allowing legitimate work. Blocking everything would prevent the network call, but it would also prevent the agent from doing anything useful. The difficulty is telling the two apart when someone is deliberately trying to make that hard.

I want the experiment to help us examine the whole interaction: what the agent attempted, what evidence the monitor had, and where the attempt was caught or slipped through. Whether the flag was planted is the outcome; understanding how it happened is where we might learn something.

## What I want to investigate

There are several questions I want to explore with this setup:

- Does giving the monitor more context help it catch evasions?
- Does an apparent improvement hold up once the attacker knows about it?
- How often does a stricter monitor block ordinary work?
- How much effort does it take to find an evasion compared with fixing one?

That last question is especially interesting to me. A defense might stop a particular attempt while leaving the attacker plenty of other options. I want to understand how changes to the setup affect the relative difficulty of evasion and detection, and whether any control techniques reliably improve that balance.

## What a result would tell us

A successful evasion tells us that this agent, with these instructions, got past this monitor in this environment. Connecting that result to a real lab audit takes further work. Likewise, a monitor that catches every attempt we tried has only been tested against those attempts.

The connection to auditing frontier labs is a motivation for the experiment. An auditor may also have to detect a prohibited action using incomplete evidence, while the party being audited has an incentive to evade detection. A toy agent leaves out the people, infrastructure, and institutions involved in that situation, but it gives us a manageable place to investigate part of the problem.

For the broader ambition behind these experiments, see [Why I’m doing this](/writing/why-im-building-this/). Here, the starting point is a specific challenge: try to get the agent past the monitor, then work out what the attempt teaches us about the control setup.
