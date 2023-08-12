const Tokenizer = require('gpt3-tokenizer').default;
const tokenizer = new Tokenizer({ type: 'gpt3' });

class KeyValueStore {
    constructor() {
        this.store = {};
    }

    get(key) {
        return this.store[key];
    }

    set(key, value) {
        this.store[key] = value;
    }
}

const storage = new KeyValueStore();

exports.writeToStorage = (uuid, value, merge = true) => {

    const startState = JSON.parse(storage.get(uuid) || "{}")

    if (merge) {
        storage.set(uuid, JSON.stringify({
            ...startState,
            ...value
        }))
    } else {
        storage.set(uuid, JSON.stringify(value))
    }

}

exports.getStorage = (uuid) => {

    return JSON.parse(storage.get(uuid) || "{}")

}

exports.validTrim = (str) => {
    const string = str.trim()

    const lastSpaceIndex = string.lastIndexOf(" ")

    if (lastSpaceIndex === -1) {
        return string.trim()
    }

    return string.substring(0, lastSpaceIndex).trim()
}

exports.getTokenizedHistoryLength = (history) => {
    let length = 0;

    for (const message of history) {
        length += tokenizer.encode(message.content).bpe.length;
    }

    return length;
}