import {Phrase} from "../../types/index.ts";
import {corsHeaders} from "../cors.ts";

export function getResponse(response: Record<string, any>) {
    return new Response(
        JSON.stringify(response),
        {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        },
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
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "of", "no", "is",
        "we", "are", "our", "to", "this", "that", "at", "be", "can", "or", "on", "a", "but", "in", "for",
        "with", "from", "as", "not", "if", "was", "were", "had", "has", "have", "will", "would", "could",
        "been", "which", "what", "where", "who", "how", "why", "there", "their", "them", "these", "those",
        "into", "out", "up", "down", "over", "under", "again", "then", "here", "there", "other", "such",
        "same", "very", "just", "too", "now", "also", "than", "more", "some", "any", "all", "most", "much",
        "many", "few", "each", "both", "own", "between", "through", "during", "before", "after", "above",
        "below", "under", "until", "while", "against", "through", "over", "between", "throughout", "without",
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
