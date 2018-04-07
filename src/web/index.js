import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

const socket = io('http://localhost:3000');

import SocketContext from './context';

const Index = () => (
    <SocketContext.Provider value={socket}>
        <App />
    </SocketContext.Provider>
);

ReactDOM.render(<Index />, document.getElementById('root'));