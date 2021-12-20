import './App.css';
import React, { useState, useContext } from 'react'
import { SequenceContext } from './App';
import { Link } from 'react-router-dom';

//api CRUD section
import { API, graphqlOperation } from 'aws-amplify'
import { listDnaSequences, listCreators } from './graphql/queries'
import { deleteDnaSequence, deleteCreator } from './graphql/mutations'

export default function SearchPage() {

  const { handleDnaSequenceSanitation,
    searchString,
    displayedSequences,
    handleSequenceChange,
    dnaSequences,
    setSearchString
  } = useContext(SequenceContext)

  const [creatorsDeleteStatus, setCreatorsDeleteStatus] = useState('')

  async function handleSearch(searchString = "") {
    if (searchString === "") {
      const response = await fetchDnaSequences()
    } else if (searchString.length < 3) {
      alert("searchs must be greater than 2bp in length")
    } else {
      console.log("searching")
      const response = await fetchDnaSequences(searchString)
    }
    setSearchString(searchString)
  }

  async function handleDelete() {
    try {
      let dnaSequencesToDelete = dnaSequences
      const response = await deleteItems(dnaSequencesToDelete);
      console.log("refresh search")
    } catch (error) {
      console.log(error)
    } finally {
      handleSearch(searchString)
    }

  }
  async function deleteItems(dnaSequencesToDelete) {
    console.log("DNA seq in handleDelete:", dnaSequencesToDelete)
    try {
      for (let i = 0; i < dnaSequencesToDelete.length; i++) {
        const dnaSequenceId = dnaSequencesToDelete[i].id
        const response = await handleDeleteDnaSequence(dnaSequenceId)
        console.log("inside forloop:" + response)
      }
      console.log("end")
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async function handleDeleteDnaSequence(dnaSequenceId) {
    try {
      const response = await API.graphql(graphqlOperation(deleteDnaSequence, { input: { id: dnaSequenceId } }))
      console.log(`deleteDnaSequence`, response)
      return response
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async function handleDeleteCreator(creatorId) {
    try {
      const response = await API.graphql(graphqlOperation(deleteCreator, { input: { id: creatorId } }))
      console.log(`deleteCreator`, response)
      return response
    } catch (error) {
      console.log(error)
      return error
    }
  }

  //in order to provide a way to remove creators from their collection we have this function
  async function handleAllCreatorDelete() {
    try {
      let creators = await API.graphql(graphqlOperation(listCreators))
      console.log("creators: " + JSON.stringify(creators))
      let creatorIds = await creators.data.listCreators.items
      creatorIds.forEach(async creator => await handleDeleteCreator(creator.id))
      setCreatorsDeleteStatus("Creator delete successful")
    } catch (error) {
      console.log(error)
      return error
    }
  }

  function handleDisplayedSequencesChange(newDnaSequences) {
    handleSequenceChange(newDnaSequences)

  }

  async function fetchDnaSequences(searchString = "", limit = 500) {
    try {
      const dnaSequenceData = await API.graphql(graphqlOperation(listDnaSequences, {
        filter: { bases: { contains: searchString } },
        limit: limit
      }))
      const fetchedDnaSequences = await dnaSequenceData.data.listDnaSequences.items
      console.log(fetchedDnaSequences)
      handleDisplayedSequencesChange(fetchedDnaSequences)
      return fetchedDnaSequences
    } catch (error) {
      console.log(error)
      alert("error fetching dnaSequences")
    }
  }





  return (
    <div className="App">
      <header className="App-header">
        <Link className="nav-btn" to='/data-upload'>
          <div>
            Import Data
          </div>
        </Link>
        <label
          htmlFor="searchString"
          className="search"
          title="A-T-C-G characters only">
          Bases Search string:
        </label>
        <input
          type="text"
          name="searchString"
          id="searchString"
          className="search-input"
          placeholder="Search for a base sequence"
          value={searchString}
          onChange={event => handleDnaSequenceSanitation(event.target.value)}
        />

        <button onClick={() => handleSearch(searchString)}>Retrieve Matching Sequences</button>
        <button onClick={() => handleDelete()}>Delete {displayedSequences.length} Displayed Sequences</button>
        <button onClick={() => handleAllCreatorDelete()}>Delete all creators </button>
        <div style={{ color: "green", fontSize: "18px", }}>{creatorsDeleteStatus}</div>

      </header>
      <div className="">
        {displayedSequences}
      </div>

    </div>
  )
}
