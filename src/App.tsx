import React from 'react';
import logo from './logo.svg';
import * as WordingOptions from './view/wording_options';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Rewrite your text using Chat GPT
      </header>
      <span className='formSumary'>Welcome, thank you for using our tool. We use Chat GPT to help you rewrite any peace of text into any version you would like. Feel free to play around with the tool.</span>
      <span className="formTitle">Enter the text to rewrite below</span>
      <textarea  className="textInput">
      </textarea>
      <span className="formTitle">How would you like to GPT to reword your text</span><br/>
      <WordingOptions.WordingOptions placeHolder="Select..."/>
      <span className="formTitle">Set a limit on the number of words to get back</span>
      <input className="maxTextSize" placeholder='Max length of response text...'/>
      <button className="submit">Submit</button>
      <span className="formTitle">Your response will be displayed below ...</span>
    </div>
  );
}

export default App;
