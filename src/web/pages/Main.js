import React from 'react';
import request from 'superagent';
import { Alert, Button, FormGroup, Label } from 'reactstrap';

import {
    doesRepositoryExist,
    storeRepository
} from '../actions';

import { getRepositoryURL, isValidUrl } from '../../tools/validator';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faEye from '@fortawesome/fontawesome-free-solid/faEye';
import faGithubAlt from '@fortawesome/fontawesome-free-brands/faGithubAlt';

import Input from '../components/Input';
import FeedData from '../components/FeedData';
import WatchList from '../components/WatchList';
import WorkerConfig from '../components/WorkerConfig';
import BotStatus from '../components/BotStatus';

import SocketContext from '../context';

class Main extends React.PureComponent
{
    input;
    watchList;

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            exists: false,
            error: null,
            data: null
        };

        this._handleAnalize = this._handleAnalize.bind(this);
        this.storeUrl       = this.storeUrl.bind(this);

        this.props.socket.on('scrap:start', this._handleStartScrap.bind(this));
        this.props.socket.on('scrap:error', this._handleScrapError.bind(this));
        this.props.socket.on('scrap:result', this._handleScrapResult.bind(this));
    }

    _handleStartScrap(data) {
        this.setState({ loading: true, error: null, exists: false, data: null });
    }

    _handleScrapError(data) {
        this.setState({ loading: false, error: data.message });
    }

    async _handleScrapResult(data) {
        if (data) {
            try {
                const result = await doesRepositoryExist(data.feed.repository);
                const exists = data.internal != null;

                this.setState({ 
                    loading: false, 
                    error: null,
                    data, 
                    exists
                });
            } catch (error) {
                this.setState({ loading: false, error: error.message });
            }
        }
    }

    _handleAnalize () {
        if (!this.state.loading) {
            
            const value = this.input.getValue();

            if (value.length > 0 && isValidUrl(value)) {
                this.props.socket.emit('scrap', { 
                    url: this.input.getValue()
                });
            } else {
                this.setState({ loading: false, error: "Invalid entry" });
            }
        }
    }

    async storeUrl() {
        const { url, updated_at } = this.state.data.feed

        const data = {
            url,
            repository: getRepositoryURL(url),
            last_updated: updated_at
        };

        try {
            const existCheck = await doesRepositoryExist(data.repository);
            
            if (existCheck.body.exists) {
                this.setState({ loading: false, error: "You are already watching this repository" });
                return;
            }

            const result = await storeRepository(data);

            this.watchList.reloadList();
            this.input.clearValue();

            const { status, error } = result.body;

            this.setState({ 
                status,
                error,
                data: null
            });
        } catch (error) {
            this.setState({ error });
        }
    }

    componentDidCatch(error, info) {
        this.setState({ error: `APPLICATION ERROR: ${error.message}` });
    }

    renderError() {
        if (this.state.error) {
            return <Alert color="danger" className="error-message">{this.state.error}</Alert>
        }
    }

    render() {
        const canWatch = !(this.state.loading || this.state.data == null || this.state.exists);
        return (
            <React.Fragment>
                <h1 className="title"><FontAwesomeIcon icon={faGithubAlt} /> Github Release Notifier</h1>
                <div className="main-container">
                    
                    <SocketContext.Consumer>
                        {(socket) => <WatchList ref={ref => this.watchList = ref} socket={socket} />}
                    </SocketContext.Consumer>

                    <div className="form-container">
                        <div className="container-small">

                            <Input ref={ref => this.input = ref} 
                                validator={isValidUrl} 
                                placeholder={`https://github.com/author/repository/releases`}
                            />

                            <Button color="primary" onClick={this._handleAnalize} disabled={this.state.loading}>
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>

                            <Button color="info" onClick={this.storeUrl} disabled={!canWatch}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>

                            {this.renderError()}
                        </div>
                        
                        <FeedData loading={this.state.loading} data={this.state.data} />

                        <WorkerConfig />
                        <BotStatus />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Main;