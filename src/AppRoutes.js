import React from 'react'
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import SearchPage from "./SearchPage";
import DataUploadPage from "./DataUploadPage";
import LazyLoading from "./LazyLoading";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SearchPage />}></Route>
                <Route path="/search" element={<SearchPage />}></Route>
                <Route path="/data-upload" element={<DataUploadPage />}></Route>
                <Route path="/lazy" element={<LazyLoading />}></Route>
            </Routes>
        </Router>
    );

}
