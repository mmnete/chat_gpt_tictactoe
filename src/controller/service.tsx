import { Configuration, OpenAIApi } from "openai";
import * as keys from './keys';

const configuration = new Configuration({
  apiKey: keys.CHAT_GPT_KEY,
});

const openai = new OpenAIApi(configuration);

const PROMPT_PRE_TEXT = 'You: May you please reword the follow text into ';

const MAXIMUM_TEXT_SIZE = 500;
const MINIMUM_TEXT_SIZE = 20;
const MINIMUM_RESPONSE_SIZE = 10;

export enum Wording {
   SIMPLE,
   SHAKESPEAREAN,
   STREET,
   TEACHING,
   COMPLICATED,
}

export enum RequestStatus {
    SUCCESS,
    ERROR,
    UNDEFINED,
 }

export class TextRequest {
     wording: Wording;
     text: string;
     responseLength: number;

     constructor(wording: Wording, text: string, responseLength: number) {
        this.text = text;
        this.wording = wording;
        this.responseLength = responseLength;
    }
}

export class TextResponse {
   text: string;
   status: RequestStatus = RequestStatus.UNDEFINED;
   errorText: string = '';

   constructor(text: string) {
      this.text = text;
      this.status = RequestStatus.SUCCESS;
   }

   static createError(newErrorText: string): TextResponse {
     var errorResponse = new TextResponse('');
     errorResponse.errorText = newErrorText;
     errorResponse.status = RequestStatus.ERROR;
     return errorResponse;
   }
}

export function getWording (stringValue: string): Wording {
     switch (stringValue) {
        case Wording.SIMPLE.toString():
            return Wording.SIMPLE;
        case Wording.COMPLICATED.toString():
            return Wording.COMPLICATED;
        case Wording.SHAKESPEAREAN.toString():
            return Wording.SHAKESPEAREAN;
        default:
            return Wording.STREET;
     }
}

export async function makeRequest(textRequest: TextRequest): Promise<TextResponse> {
    
    if (textRequest.text.length < MINIMUM_TEXT_SIZE) {
        return Promise.resolve(TextResponse.createError(`Input text too small, please have atleast ${MINIMUM_TEXT_SIZE} characters`));
    }

    if (textRequest.text.length > MAXIMUM_TEXT_SIZE) {
        return Promise.resolve(TextResponse.createError(`Input text too large, please make it less than ${MAXIMUM_TEXT_SIZE} characters`));
    }

    if (textRequest.responseLength < MINIMUM_RESPONSE_SIZE) {
        return Promise.resolve(TextResponse.createError(`Response text length should be more than ${MINIMUM_RESPONSE_SIZE}.`)); 
    }

    if (textRequest.text.length < textRequest.responseLength) {
        return Promise.resolve(TextResponse.createError(`Response text length should not be longer than the text entered. Please make it less than ${textRequest.text.length}.`)); 
    }

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: PROMPT_PRE_TEXT + textRequest.wording.toString().toLowerCase() + ' phrasing in english in ' + textRequest.responseLength.toString() + ' characters - ' + textRequest.text + '\nFriend:',
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });

    return Promise.resolve(new TextResponse(response.data?.choices?.at(0)?.text || ''));
} 

