import React from 'react';
import * as WordingOptions from './view/wording_options';
import * as service from './controller/service';
import './App.css';

function App() {
   var wording = '';
   var maxNumber = 0;
   const [charCount, setCharCount] = React.useState(0);
   const [isFetching, setIsFetching] = React.useState(false);
   const [textInput, setTextInput] = React.useState('');
   const [currError, setCurrError] = React.useState('');
   const [outputText, setOutputText] = React.useState('');

   const getWording = (newWording: string) => {
    wording = newWording;
   };

  const getTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setTextInput(newText);
    setCharCount(newText.trim().length);
   };

  const getMaxTextSize = (event: React.ChangeEvent<HTMLInputElement>) => {
     maxNumber = parseInt(event.target.value);
   };

  const submitRequest = async () => {
    setCurrError('');
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    service.makeRequest(new service.TextRequest(service.getWording(wording), textInput.trim(), maxNumber)).then((
      response: service.TextResponse) => {
        if (response.status === service.RequestStatus.ERROR) {
            setCurrError(response.errorText);
        } else if (response.status === service.RequestStatus.SUCCESS) {
          setOutputText(response.text);
        } else {
            setCurrError('There was some kind of problem with the server. May you try again or contact mnetemohamed@gmail.com');
        }
        setIsFetching(false);
      });
  };

  const errorText = () => {
        return currError;
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
      <textarea className="textInput" onChange={getTextInput} value={textInput}>
      </textarea>
      <span className="charCount">{charCount} characters entered.</span>
      <span className="formTitle">How would you like to GPT to reword your text</span><br/>
      <WordingOptions.WordingOptions placeHolder="Select..." onChange={getWording} />
      <span className="formTitle">Set a limit on the number of words to get back</span>
      <input className="maxTextSize" placeholder='Max length of response text...' type='number' onChange={getMaxTextSize}/>
      <button className="submit" onClick={submitRequest}>{getSubmitButtonText()}</button>
      <div className="error">{errorText()}</div>
      <span className="formTitle">Your response will be displayed below</span>
      <textarea className="textInput" defaultValue={outputText} disabled={true}></textarea>
      <span className='mastHead'>Developed with love by <a href="https://www.linkedin.com/in/mmnete" target="_blank"><i>Mohamed Mnete</i></a></span>
    </div>
  );
}

export default App;
