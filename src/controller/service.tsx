

export enum Wording {
   SIMPLE,
   SHAKESPEAREAN,
   STREET,
   TEACHING,
   COMPLICATED,
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

   constructor(text: string) {
      this.text = text;
   }
}