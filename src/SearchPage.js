import './App.css';
import React, { useEffect, useContext } from 'react'
import { SequenceContext } from './App';
import { Link } from 'react-router-dom';

//api CRUD section
import { API, graphqlOperation } from 'aws-amplify'
import { listDnaSequences } from './graphql/queries'
import { deleteDnaSequence, deleteCreator } from './graphql/mutations'
export default function SearchPage() {

  const { handleDnaSequenceSanitation,
    searchString,
    displayedSequences,
    handleSequenceChange,
    dnaSequences,
  } = useContext(SequenceContext)

  function handleSearch() {
    if (searchString === "") {
      fetchDnaSequences()
    } else if (searchString.length < 3) {
      alert("searchs must be greater than 2bp in length")
    } else {
      console.log("searching")
      fetchDnaSequences(searchString)
    }
  }

  function handleDelete() {

    console.log("DNA seq in handleDelete:", dnaSequences)
    dnaSequences.forEach(dnaSequence => {
      try {
        API.graphql(graphqlOperation(deleteDnaSequence, { input: { id: dnaSequence.id } }))
      } catch (error) {
        console.log(error)
      }

      try {
        API.graphql(graphqlOperation(deleteCreator, { input: { id: dnaSequence.creator.id } }))
      } catch (error) {
        console.log(error)
      }

    })
    handleDisplayedSequencesChange([])

  }

  function handleDisplayedSequencesChange(dnaSequences) {
    handleSequenceChange(dnaSequences)

  }

  async function fetchDnaSequences(searchString = "", limit = 500) {
    try {
      const dnaSequenceData = await API.graphql(graphqlOperation(listDnaSequences, {
        filter: { bases: { contains: searchString } },
        limit: limit
      }))
      const fetchedDnaSequences = dnaSequenceData.data.listDnaSequences.items
      console.log(fetchedDnaSequences)
      handleDisplayedSequencesChange(fetchedDnaSequences)
    } catch (error) {
      console.log(error)
      alert("error fetching dnaSequences")
    }
  }

  useEffect(() => {
    fetchDnaSequences()

  }, [])


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
          className="search">
          Search string:
        </label>
        <input
          type="text"
          name="searchString"
          id="searchString"
          className="searchInput"
          value={searchString}
          onChange={event => handleDnaSequenceSanitation(event.target.value)}
        />

        <button onClick={() => handleSearch()}>Retrieve Matching Sequences</button>
        <button onClick={() => handleDelete()}>Delete Matching Sequences</button>


      </header>
      <div className="">
        {displayedSequences}
      </div>

    </div>
  )
}
