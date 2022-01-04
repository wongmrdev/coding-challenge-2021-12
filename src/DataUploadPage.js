import './App.css';
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { SequenceContext } from './App';
//graphql queries 
import { listDnaSequences } from './graphql/queries'
//api CRUD section
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createCreator, createDnaSequence } from './graphql/mutations'
import { getDnaSequence, getCreator } from './graphql/queries'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);


function App() {
  const {
    searchString,
    handleSequenceChange,
    setSearchString,

  } = useContext(SequenceContext)

  function handleSearch(searchString = "") {
    if (searchString === "") {
      fetchDnaSequences()
    } else if (searchString.length < 3) {
      alert("searchs must be greater than 2bp in length")
    } else {

      fetchDnaSequences(searchString)
    }
    setSearchString(searchString)
  }

  async function fetchDnaSequences(searchString = "", limit = 500) {
    try {
      const dnaSequenceData = await API.graphql(graphqlOperation(listDnaSequences, {
        filter: { bases: { contains: searchString } },
        limit: limit
      }))
      const fetchedDnaSequences = dnaSequenceData.data.listDnaSequences.items

      handleDisplayedSequencesChange(fetchedDnaSequences)
    } catch (error) {
      console.error(error)
      alert("error fetching dnaSequences")
    }
  }


  function handleDisplayedSequencesChange(newDnaSequences) {
    handleSequenceChange(newDnaSequences)

  }

  const [textAreaValue, setTextAreaValue] = useState("")
  //upload status feedback for the user
  const [uploadStatusList, setUploadStatusList] = useState(["choose files to upload"])
  //disable buttons while request is inflight
  const [isDisabled, setIsDisabled] = useState(false)

  function handleTextAreaChange(value) {
    setTextAreaValue(value)
  }


  function handleTextAreaSubmit() {
    setIsDisabled(true)
    if (!isJson(textAreaValue)) {
      setUploadStatusList([...uploadStatusList, "text area not valid Json"])
      setIsDisabled(false)
      return
    }
    let dnaSequence = JSON.parse(textAreaValue)
    if (hasDnaSequenceProperties(dnaSequence)) {
      addDnaSequence(dnaSequence).then(response => {
        setUploadStatusList([...uploadStatusList, `manual input: ${response.dnaSequence.message}, ${response.creator.message}`])
      })

    } else {
      setUploadStatusList([...uploadStatusList, "manual input: check your input"])

    }
    handleSearch(searchString)
    setIsDisabled(false)

  }
  //check for valid json submissions
  function isJson(str) {
    try {
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }
  //check to make sure the sequence doesnt already exist
  //upload a file and read the json file

  //sanatise input files, could add more to make sure the data-types are correct
  function hasDnaSequenceProperties(item) {

    if (item.hasOwnProperty("name")
      && item.hasOwnProperty("bases")
      && item.hasOwnProperty("id")
      && item.hasOwnProperty("creator")
      && item.hasOwnProperty("createdAt")
      && item.creator.hasOwnProperty("id")
      && item.creator.hasOwnProperty("handle")
      && item.creator.hasOwnProperty("name")
      && item.creator.id !== null
      && item.creator.handle !== null
      && item.creator.name !== null
      && typeof item.id === "string"
      && typeof item.createdAt === "string"
      && typeof item.name === "string"
      && typeof item.bases === "string"
      && typeof item.creator.id === "string"
      && typeof item.creator.handle === "string"
      && typeof item.creator.name === "string"
    ) {
      return true
    }
    else {
      console.error("item is missing a property or property data-type is incorrect")
      return false
    }
  }

  //read a file 


  async function handleFileListSubmit(fileList) { //FileList is an HTML Collection
    setIsDisabled(true)
    let newItems = []
    //loop over fileList and start async post request
    for (let i = 0; i < fileList.length; i++) {
      let item = fileList.item(i)
      let response = await handleDnaSequenceAdds(item)
      newItems.push(handleFileListSubmitResponse(item.name, response))

    }
    handleUploadStatusListChange(newItems)
    handleSearch(searchString)
    setIsDisabled(false)

  }

  async function handleDnaSequenceAdds(item) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        let result = JSON.parse(reader.result)
        let response = addDnaSequence(result)
        resolve(response)
      }
      reader.readAsText(item)
    })

  }

  function handleFileListSubmitResponse(fileName, addDnaSequenceResposne) {
    let dnaS = addDnaSequenceResposne.dnaSequence.status ? addDnaSequenceResposne.dnaSequence.status : null
    let creatorS = addDnaSequenceResposne.creator.status ? addDnaSequenceResposne.creator.status : null
    let dnaM = addDnaSequenceResposne.dnaSequence.message ? addDnaSequenceResposne.dnaSequence.message : null
    let creatorM = addDnaSequenceResposne.creator.message ? addDnaSequenceResposne.creator.message : null
    if (addDnaSequenceResposne.status === false) {
      return `${fileName}: failed on error`
    } else {
      return `${fileName}: DNA Sequence ${dnaS}(${dnaM}), Creator: ${creatorS}(${creatorM})`
    }

  }

  function handleUploadStatusListChange(newItems) {
    setUploadStatusList([...uploadStatusList, ...newItems])
  }


  //push the data to the Database
  async function addDnaSequence(dnaSequenceObject) {
    let dnaSequenceObjectInput = {
      name: dnaSequenceObject.name,
      id: dnaSequenceObject.id,
      createdAt: dnaSequenceObject.createdAt,
      bases: dnaSequenceObject.bases.toUpperCase(),
      creatorDnaSequenceId: dnaSequenceObject.creator.id,

    }
    let creatorObjectInput = {
      id: dnaSequenceObject.creator.id,
      handle: dnaSequenceObject.creator.handle,
      name: dnaSequenceObject.creator.name
    }
    //tell the user if the upload failed or succeeded
    let response = {}
    try {
      if (!hasDnaSequenceProperties(dnaSequenceObject)) { return false }
      const dnaSequence = await API.graphql(graphqlOperation(getDnaSequence, { id: dnaSequenceObject.id }))
      const creator = await API.graphql(graphqlOperation(getCreator, { id: dnaSequenceObject.creator.id }))
      if (dnaSequence.data.getDnaSequence) {
        response = { ...response, dnaSequence: { status: "failed", message: "DNA Sequence already exists" } }
      } else {
        await API.graphql(graphqlOperation(createDnaSequence, { input: dnaSequenceObjectInput }))
        response = { ...response, dnaSequence: { status: "success", message: "Upload success" } }
      }
      if (creator.data.getCreator) {
        response = { ...response, creator: { status: "failed", message: "creator Already Exists" } }
      } else {
        await API.graphql(graphqlOperation(createCreator, { input: creatorObjectInput }))
        response = { ...response, creator: { status: "success" } }
      }
      return response
    } catch (error) {
      response = { status: "failed", message: "unknown error, see log", creator: { status: "failed" }, dnaSequence: { status: "failed" } }
      return response
    }

  }



  return (
    <div>

      <div className="App">
        <header className="App-header">
          {<Link disabled={isDisabled} className="nav-btn" to='/search'>
            <div>
              Search Data
            </div>
          </Link>}
          <label id="data-upload-title" htmlFor="createDnaSequence">Add JSON format DNA Sequence</label>
        </header>
      </div>
      <div className="data-upload-container">
        <textarea
          value={textAreaValue}
          onChange={(event) => handleTextAreaChange(event.target.value)}
          name="createDnaSequence"
          cols={100}
          rows={25}
        />
        <span disabled={isDisabled} className="submit-data-btn" onClick={() => handleTextAreaSubmit()}>Submit Data</span>
      </div>
      <div id="bulk-uploads-container">Bulk Uploads</div>
      <div className="vertical-flex-container">
        <input disabled={isDisabled} type="file" id="bulk-uploads" multiple accept=".json, .txt" onChange={(event) => handleFileListSubmit(event.target.files)}></input>
        <ul>
          {
            uploadStatusList.map((status, index) => <li key={index}>{index === 0 ? "" : index + "."} {status}</li>)
          }
        </ul>
      </div>



    </div>
  );
}
export default App;
