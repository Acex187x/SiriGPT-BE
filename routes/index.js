const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { kvsEnvStorage } = require('@kvs/env');
const crypto = require('crypto');
const { DB_NAME } = require('../constants');
const { writeToStorage, getStorage, validTrim } = require('../utils');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = {
  role: "system",
  content: `Act as a voice assistant named Siri-GTP.`
}

/* GET home page. */
router.post('/', async function(req, res, next) {

  res.set({ 'content-type': 'application/json; charset=utf-8' });

  const sessionId = req.session.hash || crypto.randomUUID();

  if (!req.session.hash) {
    req.session.hash = sessionId;
  }

  const startState = await getStorage(sessionId)
  const prompt = req.body?.prompt || startState.prompt;

  let history = startState?.history || [
    systemPrompt
  ];

  if (req.body?.prompt) {
    writeToStorage(sessionId, {
      prompt: req.body?.prompt,
      response: "",
      firstSent: false,
      finished: false,
    })

    history.push({
      role: "user",
      content: prompt
    })
  } else {
    if (startState?.response) {

      if (startState.finished) {
        writeToStorage(sessionId, {
          response: "",
        })
        return res.send(startState.response)
      }

      const trimmed = validTrim(startState.response)

      writeToStorage(sessionId, {
        response: startState.response.replace(trimmed, ""),
      })

      return res.send(trimmed);
    } else {
      return res.send("[END]")
    }
  }

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: history,
    max_tokens: 15000,
    temperature: 0.8,
    top_p: 1,
    stream: true,
  }, { responseType: 'stream' });

  chatCompletion.data.on('data', async data => {
    const state = getStorage(sessionId);

    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const message = line.replace(/^data: /, '');
      if (message === '[DONE]') {
        state.finished = true;
        if (!state.firstSent) {
          res.send(state.response);
          state.response = "";
        }
        writeToStorage(sessionId, state, false);
        return
      }

      const parsed = JSON.parse(message);
      const content = parsed.choices[0].delta.content;

      if (content) {
        state.response += content;
      }

      if (state?.response?.length > 120 && !state?.firstSent) {
        state.firstSent = true;
        const trimmed = validTrim(state.response)
        res.send(trimmed);
        state.response = state.response.replace(trimmed, "");
      }

      writeToStorage(sessionId, state, false);
    }
  });
});

module.exports = router;
