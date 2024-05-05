import {Phrase} from "../../types/index.ts";
import {corsHeaders} from "../cors.ts";

export function getResponse(response: Record<string, any>) {
    return new Response(
        JSON.stringify(response, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
        {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        },
    );
}

export function respond(context: any, response: any) {
    context.response.headers.set('Access-Control-Allow-Origin', '*');
    context.response.headers.set('Access-Control-Allow-Headers', '*');
    context.response.headers.set('Access-Control-Allow-Methods', '*');
    if (typeof response === 'string') {
        return context.response.body = response;
    }
    context.response.headers.set('Content-Type', 'application/json');
    return context.response.body = JSON.stringify(response, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
}


export function toPhrase(params: { phrase?: string, meaning?: string, id?: string }): Phrase {
    return {id: uniqId() || params.id, ...params};
}

export function uniqId() {
    return Math.random().toString(36).substr(2, 9);
}


export function splitTextIntoPhrases(text: string): Phrase[] {
    const words = text.toLowerCase().replace(/[^a-z-;'\s]/g, '').split(/\s+/);
    console.log('words', words)
    const phrases: Phrase[] = [];
    let currentPhrase = '';

    words.forEach(word => {
        if (word.endsWith(';')) {
            if (currentPhrase) {
                phrases.push(toPhrase({phrase: currentPhrase}));
                currentPhrase = '';
            }
            phrases.push(toPhrase({phrase: word.replace(/;/g, '')}));
            return;
        } else
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


const ignoredWords = new Set([
    ";","and", "so", "the", "then", "an", "by", "it", "only", "about", "when",
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "of", "no", "is",
    "we", "are", "our", "to", "this", "that", "at", "be", "can", "or", "on", "a", "but", "in", "for",
    "with", "from", "as", "not", "if", "was", "were", "had", "has", "have", "will", "would", "could",
    "been", "which", "what", "where", "who", "how", "why", "there", "their", "them", "these", "those",
    "into", "out", "up", "down", "over", "under", "again", "then", "here", "there", "other", "such",
    "same", "very", "just", "too", "now", "also", "than", "more", "some", "any", "all", "most", "much",
    "many", "few", "each", "both", "own", "between", "through", "during", "before", "after", "above",
    "below", "under", "until", "while", "against", "through", "over", "between", "throughout", "without",
    "must", "her", "you", "it's", "it", "he", "she", "him", "his", "hers", "they", "them", "their", "theirs",
    "whats", "your", "let's", "let", "i", "me", "my", "mine", "us", "we", "our", "ours", "yours", "yourself",
    "yourselves", "himself", "herself", "themselves", "itself", "this", "that", "these", "those", "who",
    "whom", "whose", "which", "what", "whatever", "whoever", "whichever", "whomever", "whenever", "wherever",
    "however", "why", "when", "where", "what's", "which", "who's", "whoever's", "whichever", "whomever",
    "whatever's", "whenever", "wherever", "however", "why", "when", "where", "what's", "which", "who's",
    "whoever's", "whichever", "whomever", "whatever's", "whenever", "wherever", "however", "why", "when",
    "where", "what's", "which", "who's", "whoever's", "whichever", "whomever", "whatever's", "whenever",
    "wherever", "however", "why", "when", "where", "what's", "which", "who's", "whoever's", "whichever",
]);
