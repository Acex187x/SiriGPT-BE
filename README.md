# SiriGPT-BE
Solution for using ChatGPT with Siri, the main advantage of which is a consistently high first response rate from the model. Working perfectly on Homepod and other iOS devices.
## Installation
- Create OpenAI account if you don't have one. You can do it [here](https://platform.openai.com/signup).
- Create OpenAI API key. You can do it [here](https://platform.openai.com/account/api-keys).
- Deploy SiriGPT Back-End using button below. When clicking, you will be offered to enter `OPENAI_TOKEN` environment variable to Railway. It's a token you got on previous step.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/rd6XeO?referralCode=7gT78Y)

- Install [Siri Shortcut](https://www.icloud.com/shortcuts/0f8e5c83bd224a34ab1bed4ddba1f949). When installing, you will be offered to enter back-end link. Use the one you got on previous step.
- Here you go! Say `Hey Siri GPT` wait for a first response from shorcut and ask your question.

## Updating
- Go to Railway dashboard and find your SiriGPT Back-End app.
- Go to your deployment setting and click `Check for Updates` button

![screenshot](https://i.imgur.com/GF3kYDL.png)

- Go to GitHub repository Railway created on first deployment and merge the PR Railway created for you.
- That's it! Your SiriGPT Back-End is updated.

## Problematics
While other attempts to create Siri Shortcuts for GPT-3 are using OpenAI API directly, which limits response time because of inability of Apple Shortcuts to fetch SSE (**S**erver **S**ent **E**vents), SiriGPT uses its own back-end allowing fetching new response data while Siri is dictating last answer.

![screenshot](https://i.imgur.com/Axgm48s.png)

## Roadmap
- [ ] Add ability to make more than one message in conversation.
- [ ] Integration with [AutoGPT](https://github.com/Significant-Gravitas/Auto-GPT)
- [ ] Integration with HomeKit
- [ ] Persobality Switcher (see my openai-grammy-bot repo)