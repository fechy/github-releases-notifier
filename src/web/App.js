import React from 'react';

import Main from './pages/Main';
import SocketContext from './context';

class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidCatch(error) {
        this.setState({ error: `APPLICATION ERROR: ${error.message}` });
    }

    render() {
        return (
            <div className="app-container">
                {this.state.error && <div>{this.state.error}</div>}
                <SocketContext.Consumer>
                    { socket => <Main socket={socket} />}
                </SocketContext.Consumer>
            </div>
        );
    }
}

export default App;