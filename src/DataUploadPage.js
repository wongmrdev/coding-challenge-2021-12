import './App.css';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

//api CRUD section
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createCreator, createDnaSequence } from './graphql/mutations'
import { getDnaSequence, getCreator } from './graphql/queries'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  const [textAreaValue, setTextAreaValue] = useState("")
  //upload status feedback for the user
  const [uploadStatusList, setUploadStatusList] = useState(["choose files to upload"])

  function handleTextAreaChange(value) {
    setTextAreaValue(value)
  }


  function handleTextAreaSubmit() {
    isJson(textAreaValue) ? console.log(textAreaValue) : setUploadStatusList([...uploadStatusList, "text area not valid Json"])
    let dnaSequence = JSON.parse(textAreaValue)
    if (hasDnaSequenceProperties(dnaSequence)) {
      addDnaSequence(dnaSequence).then(response => {
        console.log(response)
        setUploadStatusList([...uploadStatusList, `manual input: ${response.dnaSequence.message}, ${response.creator.message}`])
      })

    } else {
      setUploadStatusList([...uploadStatusList, "manual input: check your input"])
    }



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
    console.log("item: ", item);
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
    ) {
      return true
    }
    else {
      console.log("item is missing a property")
      return false
    }
  }

  //read a file 


  function handleFileListSubmit(fileList) { //FileList is an HTML Collection

    let newItems = [];
    for (let i = 0; i < fileList.length; i++) {
      console.log("file name: ", fileList.item(i).name)
      let item;
      let reader = new FileReader();
      reader.onload = function () {
        item = JSON.parse(reader.result)
        console.log(item)
        addDnaSequence(item).then(response => {
          console.log("response: ", response)

        })
      }
      reader.readAsText(fileList.item(i))
    }
    //update progress of file upload

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
      console.log(dnaSequence)
      const creator = await API.graphql(graphqlOperation(getCreator, { id: dnaSequenceObject.creator.id }))
      console.log(creator)
      if (dnaSequence.data.getDnaSequence) {
        console.log("sequence exists")
        response = { ...response, dnaSequence: { status: "failed", message: "DNA Sequence already exists" } }
      } else {
        await API.graphql(graphqlOperation(createDnaSequence, { input: dnaSequenceObjectInput }))
        console.log("upload complete for DNA Sequence" + dnaSequenceObject.name)
        response = { ...response, dnaSequence: { status: "success", message: "Upload success" } }
      }
      if (creator.data.getCreator) {
        console.log("creator exists")
        response = { ...response, creator: { status: "failed", message: "creator Already Exists" } }
      } else {
        await API.graphql(graphqlOperation(createCreator, { input: creatorObjectInput }))
        console.log("upload complete for creator Sequence" + dnaSequenceObject.creator.name)
        response = { ...response, creator: { status: "success" } }
      }
      return response

    } catch (error) {
      console.log("error adding DNA sequence on POST", error)
      response = { status: "failed", message: "unknown error, see log", creator: { status: "failed" }, dnaSequence: { status: "failed" } }
      return response

    }

  }



  return (
    <div>

      <div className="App">
        <header className="App-header">
          <Link className="nav-btn" to='/search'>
            <div>
              Search Data
            </div>
          </Link>
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
        <span className="submit-data-btn" onClick={() => handleTextAreaSubmit()}>Submit Data</span>
      </div>

      <div id="bulk-uploads-container">Bulk Uploads</div>
      <div className="vertical-flex-container">
        <input type="file" id="bulk-uploads" multiple accept=".json, .txt" onChange={(event) => handleFileListSubmit(event.target.files)}></input>
        <ul>
          {
            uploadStatusList.map((status, index) => <li key={index}>{status}</li>)
          }
        </ul>
      </div>



    </div>
  );
}
export default App;
