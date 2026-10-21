---
layout: ../../layouts/Post.astro
title: What is AI control?
date: "2026-10-02"
description: Why control matters for automated auditing
---
>AI control is about mitigating risk from goal-directed misalignment, under the assumption that misalignment has already arisen. Across the stages of AI model development (training, pre-deployment testing, and deployment), control asks the question: would a given safety or security technique still work if the model were actively trying to subvert it?
>
>The most valuable thing about this framing is that it turns safety into a capabilities question (i.e. is the model capable of defeating a defense?) rather than an alignment question, which is empirically easier to answer.
>
>This reframing matters both for internal iteration and for external legibility. It also means control can be defined as two distinct things: an approach to risk assessment, and a class of techniques that might pass those assessments.[^1]

The piece I'm most interested in that middle one: "is the model capable of defeating a defense?". If we want capable monitors such that coordinated slow down is possible, we need to be confident that the models we're monitoring are not capable of defeating the monitors.

That brings up some pretty obvious questions like: if I'm monitoring the latest and greatest models (e.g. to detect if a lab is secretely trying to do a training run), how capable does my monitor need to be? What are the properties of monitor do we care most and least about? What is the set of conditions will we likely monitor and what capabilites do we need to be able to monitor them?

[Evaluating Red Team and Blue Team Capability for AI Control Research](https://www.lesswrong.com/posts/KWT2Nk2gyxTc9xowT/evaluating-red-team-and-blue-team-capability-for-ai-control) hints at a leader board for attacking and defending models to determine which side is improving faster than the other. I think this would be particularly useful, and wonder if it doesn't get made soon whether this would be a fine place to host it.

---
[^1]: ControlConf 2026: What is AI control and how has the field grown? (https://www.far.ai/blog/controlconf-2026)
