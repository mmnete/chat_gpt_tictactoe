

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

export function makeRequest(textRequest: TextRequest): Promise<TextResponse> {
    
    if (textRequest.text.length < MINIMUM_TEXT_SIZE) {
        return Promise.resolve(TextResponse.createError(`Input text to small, please have atleast ${MINIMUM_TEXT_SIZE}`));
    }

    if (textRequest.responseLength < MINIMUM_RESPONSE_SIZE) {
        return Promise.resolve(TextResponse.createError(`Response text length should be atleast ${MINIMUM_RESPONSE_SIZE}`)); 
    }

    return Promise.resolve(new TextResponse('Got it'));
} 

