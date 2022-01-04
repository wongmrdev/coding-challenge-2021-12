import React, { useState, useRef, useCallback } from 'react';
import "./css/LazyLoading.css";
import useDnaSequenceSearch from './useDnaSequenceSearch';
import ReactJson from 'react-json-view';
import "./App.css";
import { Link } from 'react-router-dom';

export default function LazyLoading() {

    const [query, setQuery] = useState('')
    const [nextToken, setNextToken] = useState(undefined)
    let options = useRef({ //ref stores in nextToken.current property
        rootMargin: '0px 0px 100px 0px',
        threshold: 1
    })
    const {
        dnaSequences,
        nextNextToken,
        loading,
        error
    } = useDnaSequenceSearch(query, nextToken)

    const observer = useRef()

    const lastDnaSequenceElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextNextToken.current) {
                setNextToken(nextNextToken.current)
            }
        }, options)
        if (node) observer.current.observe(node)
    }, [loading, nextNextToken, options])

    function handleSearch(e) {
        setQuery(e.target.value)
        setNextToken(undefined)
    }

    return (
        <>
            <header className="nav-header">
                {<Link className="nav-btn" to='/search'>
                    <div>
                        Search Data
                    </div>
                </Link>}
            </header>
            <div className="lazy-container">
                <input type="text" value={query} onChange={handleSearch}></input>
                {dnaSequences.map((dnaSequence, index) => {
                    if (dnaSequences.length === index + 1) {
                        return <div ref={lastDnaSequenceElementRef} ><ReactJson key={index} src={dnaSequence} indentWidth={8} theme="monokai" name={`Sequence  ${index + 1}`} /></div>
                    } else {
                        return <ReactJson key={index} src={dnaSequence} indentWidth={8} collapsed={true} theme="solarized" name={`Sequence  ${index + 1}`} />
                    }
                })}
                <div>{loading && 'Loading...'}</div>
                <div>{error && 'Error'}</div>
            </div>

        </>
    )
}
