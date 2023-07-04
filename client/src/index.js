import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './components/App';
import './index.css';
import Blocks from './components/Blocks.js';
import ConductTransaction from './components/ConductTransaction.js';

render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />}></Route>
            <Route path='/blocks' element={<Blocks />}></Route>
            <Route
                path='/conduct-transaction'
                element={<ConductTransaction />}
            ></Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
