import {Phrase} from "../types/index.ts";

export function getResponse(response: Record<string, any>) {
    return new Response(
        JSON.stringify(response),
        {headers: {"Content-Type": "application/json"}},
    );
}

export function toPhrase(params: { phrase?: string, meaning?: string, id?: string }): Phrase {
    return {id: uniqId() || params.id, ...params};
}

export function uniqId() {
    return Math.random().toString(36).substr(2, 9);
}


export function splitTextIntoPhrases(text: string): Phrase[] {
    const ignoredWords = new Set([
        "and", "so", "the", "then", "an", "by", "it", "only", "about", "when",
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "of", "no", "is"
    ]);
    const words = text.toLowerCase().replace(/[^a-z0-9-\s]/g, '').split(' ');
    const phrases: Phrase[] = [];
    let currentPhrase = '';

    words.forEach(word => {
        if (!ignoredWords.has(word.toLowerCase())) {
            if (currentPhrase) currentPhrase += ' ';
            currentPhrase += word;
        } else {
            if (currentPhrase) {
                phrases.push(toPhrase({phrase: currentPhrase}));
                currentPhrase = '';
            }
        }
    });

    if (currentPhrase) phrases.push(toPhrase({phrase: currentPhrase}));

    return phrases;
}
