import { useEffect, useState, useRef } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { listDnaSequences } from './graphql/queries'

export default function useDnaSequenceSearch(query, nextToken) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [dnaSequences, setDnaSequences] = useState([])
  //const [hasMore, setHasMore] = useState(false)
  const nextNextToken = useRef(undefined)

  useEffect(() => {
    setDnaSequences([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const controller = new AbortController();
    const signal = controller.signal
    API.graphql(graphqlOperation(listDnaSequences, {
      filter: { bases: { contains: query } },
      limit: 5,
      signal,
      ...nextToken && { nextToken: nextToken }
    })).then(dnaSequenceData => {
      setDnaSequences(prevDnaSequences => {
        return [...new Set([...prevDnaSequences, ...dnaSequenceData.data.listDnaSequences.items])]
      })
      if (dnaSequenceData.data.listDnaSequences.nextToken) { nextNextToken.current = dnaSequenceData.data.listDnaSequences.nextToken }
      setLoading(false)
    }).catch(err => {
      if (err.name === "AbortError") return
      setError(true)
    })
    return () => {
      controller.abort()
    }
  }, [query, nextToken, nextNextToken])

  return { dnaSequences, nextNextToken, loading, error, }
}