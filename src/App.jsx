// tools
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

// libs
import "@tools/livechat";
import Pages from './containers'

// global styles
import "@styles/root.sass";

function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<Pages />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;