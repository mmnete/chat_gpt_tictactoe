export const MAXIMUM_TEXT_SIZE = 10000;
export const MINIMUM_TEXT_SIZE = 20;

interface BackEndResponse {
    status: string;
    text: string;
    error: string;
}

function generatePrompt(wording: string, inputText: string, limit: number): string {
    inputText = inputText.replace(/(?:\r\n|\r|\n)/g, ' ');
    if (limit === -1) {
        return `Please reword the phrase into ${wording} - ${inputText}.`;  
    }
    return `Please reword the phrase into ${wording} in less than ${limit} characters - ${inputText}.`;
}

export const wordings = [
   'british gangsta slang',
   'shakespearen english',
   'swahili language',
   'arabic language',
   'spanish language',
   'irish accent',
   'complicated english',
   'lawyer language',
   'american gangsta slang'
];

export enum RequestStatus {
    SUCCESS,
    ERROR,
    UNDEFINED,
 }

export class TextRequest {
     wording: string;
     text: string;
     responseLength: number;

     constructor(wording: string, text: string, responseLength: number) {
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
     if (newErrorText.includes('429')) {
        errorResponse.errorText = 'Please wait and try again later. Server Error (Due to many requests): ' + errorResponse.errorText; 
     }
     errorResponse.status = RequestStatus.ERROR;
     return errorResponse;
   }
}

export async function makeRequest(textRequest: TextRequest): Promise<TextResponse> {
    
    if (textRequest.text.length < MINIMUM_TEXT_SIZE) {
        return Promise.resolve(TextResponse.createError(`Input text too small, please have atleast ${MINIMUM_TEXT_SIZE} characters`));
    }

    if (textRequest.text.length > MAXIMUM_TEXT_SIZE) {
        return Promise.resolve(TextResponse.createError(`Input text too large, please make it less than ${MAXIMUM_TEXT_SIZE} characters`));
    }

    if (textRequest.responseLength !== -1 && textRequest.text.length < textRequest.responseLength) {
        return Promise.resolve(TextResponse.createError(`Response text length should not be longer than the text entered. Please make it less than ${textRequest.text.length}.`)); 
    }

    if (textRequest.responseLength !== -1 && (textRequest.responseLength < MINIMUM_TEXT_SIZE || textRequest.responseLength > MAXIMUM_TEXT_SIZE) ) {
        return Promise.resolve(TextResponse.createError(`Rewording length should be between ${MINIMUM_TEXT_SIZE} and ${MAXIMUM_TEXT_SIZE} characters.`)); 
    }

    var textResponse = new TextResponse('');

    const inDev = false;

    const backend =  inDev ? 'http://localhost:4000/rewrite' : 'https://faik-gpt-backedn.onrender.com/rewrite';

    await fetch(backend, {
        method: 'POST',
        body: JSON.stringify({
          inputText: generatePrompt(textRequest.wording, textRequest.text, textRequest.responseLength)
        }),
        headers: {'Content-Type':'application/json'},
      })
      .then((response) => response.json())
      .then((responseJson) => {
        const backedResponse = responseJson as BackEndResponse;
        if (backedResponse.status === 'ERROR') {
            textResponse = TextResponse.createError(backedResponse.error);
        } else {
            textResponse = new TextResponse(backedResponse.text);
        }
       })
      .catch((err) => {
        textResponse = TextResponse.createError(err);});

    return Promise.resolve(textResponse);
} 

