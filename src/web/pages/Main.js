import React from 'react';
import request from 'superagent';

import {
    doesRepositoryExist,
    storeRepository
} from '../actions';

import { getRepositoryURL, isValidUrl } from '../../tools/validator'

import Input from '../components/Input';
import FeedData from '../components/FeedData';
import WatchList from '../components/WatchList';
import WorkerConfig from '../components/WorkerConfig';

import SocketContext from '../context';

class Main extends React.PureComponent
{
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
                const result = await doesRepositoryExist(data.repository);

                const { exists, error } = result.body;

                this.setState({ 
                    loading: false, 
                    error, data, 
                    exists
                });
            } catch (error) {
                this.setState({ loading: false, error });
            }
        }
    }

    _handleAnalize () {
        if (!this.state.loading) {
            const value = this.refs["input"].getValue();
            if (value.length > 0 && isValidUrl(value)) {
                this.props.socket.emit('scrap', { 
                    url: this.refs["input"].getValue()
                });
            } else {
                this.setState({ loading: false, error: "Invalid entry" });
            }
        }
    }

    async storeUrl() {
        const { url, updated_at } = this.state.data

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

            this.refs["watch-list"].reloadList();
            this.refs["input"].clearValue();

            const { status, error } = result.body;

            this.setState({ 
                status,
                error: error ? error.errmsg : null,
                data: null
            });
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        return (
            <div className="app-container">
                <h1>Github Release Notifier</h1>
                <WorkerConfig />
                <div className="container">
                    <WatchList ref="watch-list" socket={this.props.socket} />
                    <div className="form-container">
                        <div className="container-small">
                            <Input ref="input" validator={isValidUrl} placeholder={`https://github.com/author/repository/releases`} />
                            <button onClick={this._handleAnalize} disabled={this.state.loading}>Analize</button>
                            <button onClick={this.storeUrl} disabled={this.state.loading || this.state.data == null || this.state.exists}>WATCH</button>
                            {this.state.error ? <div className="error-message">{this.state.error}</div> : null}
                        </div>
                        <br />
                        <FeedData loading={this.state.loading} feed={this.state.data} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;