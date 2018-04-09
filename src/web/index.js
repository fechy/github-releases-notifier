import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import SocketContext from './context';

import './styles/style.css';

/* global io */
const socket = io('http://localhost:3000');

const Index = () => (
    <SocketContext.Provider value={socket}>
        <App />
    </SocketContext.Provider>
);

ReactDOM.render(<Index />, document.getElementById('root'));