import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

require('./styles/style.css');

const socket = io('http://localhost:3000');

import SocketContext from './context';

const Index = () => (
    <div className="app-container">
        <SocketContext.Provider value={socket}>
            <App />
        </SocketContext.Provider>
    </div>
);

ReactDOM.render(<Index />, document.getElementById('root'));