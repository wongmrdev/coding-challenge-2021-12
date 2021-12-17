import './App.css';
import React, { useState } from 'react'
import ReactJson from 'react-json-view';
import AppRoutes from './AppRoutes';
import { withAuthenticator } from '@aws-amplify/ui-react'
//api CRUD section
import Amplify from 'aws-amplify'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
//create context for global state and methods

export const SequenceContext = React.createContext()

function App() {

  const [searchString, setSearchString] = useState("")
  const [myImportJson, setMyImportJSON] = useState([])
  //store all the sequences you want to display in an array of
  const [dnaSequences, setDnaSequences] = useState([]);

  function handleSequenceChange(sequences) {
    setDnaSequences([...sequences])
  }

  //map them to a react component

  const displayedSequences = dnaSequences.map((sequence, index) => <ReactJson key={index} src={sequence} indentWidth={8} theme="monokai" name={`Sequence  ${index}`} />)

  function handleSearchStringChange(input) {
    setSearchString(input);
  }
  //wrapper function around searchString input to uppercase the user's input and allow only A T C G
  function handleDnaSequenceSanitation(input) {
    let uppered = input.toUpperCase()
    let regexpression = /[^ATCG]+/
    if (uppered.match(regexpression)) {
      alert("not a valid DNA Sequence (ATCGs only accepted)")
    }
    else {
      setSearchString(uppered)
    }
  }

  const SequenceContextValue = {
    handleDnaSequenceSanitation,
    handleSearchStringChange,
    handleSequenceChange,
    myImportJson,
    setMyImportJSON,
    searchString,
    setSearchString,
    displayedSequences,
    dnaSequences
  }


  return (
    <SequenceContext.Provider value={SequenceContextValue}>
      <AppRoutes />
    </SequenceContext.Provider>
  );
}

export default withAuthenticator(App);
