import React from 'react';
import ReactDOM from 'react-dom';

import Main from './pages/Main';

import SocketContext from './context';

class App extends React.PureComponent
{
    render() {
        return (
            <div className="app-container">
                <SocketContext.Consumer>
                    { socket => <Main socket={socket} />}
                </SocketContext.Consumer>
            </div>
        )
    }
}

export default App;