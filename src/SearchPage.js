import './App.css';
import React, { useState, useContext, useEffect } from 'react'
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
  const [isDisabled, setIsDisabled] = useState(false)

  async function handleSearch(searchString = "") {
    setIsDisabled(true)
    if (searchString === "") {
      const response = await fetchDnaSequences()
    } else if (searchString.length < 3) {
      alert("searchs must be greater than 2bp in length")
    } else {
      const response = await fetchDnaSequences(searchString)
    }
    setSearchString(searchString)
    setIsDisabled(false)
  }

  async function handleDelete() {
    try {
      setIsDisabled(true)
      let dnaSequencesToDelete = dnaSequences
      const response = await deleteItems(dnaSequencesToDelete);
    } catch (error) {
      console.error(error)
    } finally {
      handleSearch(searchString)
      setIsDisabled(false)
    }
  }

  async function deleteItems(dnaSequencesToDelete) {

    try {
      for (let i = 0; i < dnaSequencesToDelete.length; i++) {
        const dnaSequenceId = dnaSequencesToDelete[i].id
        const response = await handleDeleteDnaSequence(dnaSequenceId)
      }

    } catch (error) {
      console.error(error)
      return error
    }
  }

  async function handleDeleteDnaSequence(dnaSequenceId) {
    try {
      const response = await API.graphql(graphqlOperation(deleteDnaSequence, { input: { id: dnaSequenceId } }))

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async function handleDeleteCreator(creatorId) {
    try {
      const response = await API.graphql(graphqlOperation(deleteCreator, { input: { id: creatorId } }))
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //in order to provide a way to remove creators from their collection we have this function
  async function handleAllCreatorDelete() {
    try {
      setIsDisabled(true)
      let creators = await API.graphql(graphqlOperation(listCreators))
      let creatorIds = await creators.data.listCreators.items
      creatorIds.forEach(async creator => await handleDeleteCreator(creator.id))
      setCreatorsDeleteStatus("Creator delete successful")
    } catch (error) {
      console.error(error)
      return error
    } finally {
      setIsDisabled(false)
    }
  }

  function handleDisplayedSequencesChange(newDnaSequences) {
    handleSequenceChange(newDnaSequences)

  }

  async function fetchDnaSequences(searchString = "", limit = 500, signal) {
    try {
      const dnaSequenceData = await API.graphql(graphqlOperation(listDnaSequences, {
        filter: { bases: { contains: searchString } },
        limit,
        signal
      }))
      const fetchedDnaSequences = await dnaSequenceData.data.listDnaSequences.items

      handleDisplayedSequencesChange(fetchedDnaSequences)
      return fetchedDnaSequences
    } catch (error) {
      console.error(error)
      alert("error fetching dnaSequences")
    }
  }

  useEffect(() => {
    if (dnaSequences.length === 0) {
      const controller = new AbortController();
      const signal = controller.signal
      fetchDnaSequences("", 500, { signal }).catch((err) => {
        if (err.name === "AbortError") {
          console.log("successfully aborted");
        } else {
          console.error(err);
        }
      });
      return () => {
        controller.abort()
      }
    }
  }, [])

  return (
    <div className="App">
      <header className="nav-header">
        <Link disabled={isDisabled} className="nav-btn red" to='/data-upload'>
          <div>
            Import Data
          </div>
        </Link>
        <Link disabled={isDisabled} className="nav-btn red" to='/lazy'>
          <div>
            Pagination example
          </div>
        </Link>

      </header>

      <header className="App-header">
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
        <button disabled={isDisabled} onClick={() => handleSearch(searchString)}>Retrieve Matching Sequences</button>
        <button disabled={isDisabled} onClick={() => handleDelete()}>Delete {displayedSequences.length} Displayed Sequences</button>
        <button disabled={isDisabled} onClick={() => handleAllCreatorDelete()}>Delete all creators </button>

        <div style={{ color: "green", fontSize: "18px", }}>{creatorsDeleteStatus}</div>
      </header>
      <div className="">
        {displayedSequences}
      </div>
    </div>
  )
}
