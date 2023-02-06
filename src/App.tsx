import React from 'react';
import * as WordingOptions from './view/wording_options';
import * as service from './controller/service';
import './App.css';

function App() {
   var textInput = '';
   var wording = '';
   var maxNumber = 0;
   var isFetching = false;

   const getWording = (newWording: string) => {
    wording = newWording;
   };

  const getTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    textInput = event.target.value;
   };

  const getMaxTextSize = (event: React.ChangeEvent<HTMLInputElement>) => {
     maxNumber = parseInt(event.target.value);
   };

  const submitRequest = async () => {
    if (isFetching) {
      return;
    }
    isFetching = true;

    service.makeRequest(new service.TextRequest(service.getWording(wording), textInput, maxNumber)).then((
      response: service.TextResponse) => {});
  };

  const getSubmitButtonText = () => {
    return isFetching ? 'Loading' : 'Submit';
  };

  return (
    <div className="App">
      <header className="App-header">
        Rewrite your text using Chat GPT
      </header>
      <span className='formSumary'>Welcome, thank you for using our tool. We use Chat GPT to help you rewrite any peace of text into any version you would like. Feel free to play around with the tool.</span>
      <span className="formTitle">Enter the text to rewrite below</span>
      <textarea className="textInput" onChange={getTextInput}>
      </textarea>
      <span className="formTitle">How would you like to GPT to reword your text</span><br/>
      <WordingOptions.WordingOptions placeHolder="Select..." onChange={getWording} />
      <span className="formTitle">Set a limit on the number of words to get back</span>
      <input className="maxTextSize" placeholder='Max length of response text...' type='number' onChange={getMaxTextSize}/>
      <button className="submit" onClick={submitRequest}>{getSubmitButtonText()}</button>
      <span className="formTitle">Your response will be displayed below</span>
      <textarea className="textInput">
      </textarea>
    </div>
  );
}

export default App;
