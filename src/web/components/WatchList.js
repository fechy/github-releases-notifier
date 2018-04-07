import React from 'react';
import moment from 'moment';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import { Alert, ListGroup, ListGroupItem, Button, Tooltip } from 'reactstrap';

import { getWatchList, removeFromList } from '../actions';

import WatchListItem from './WatchListItem';

class WatchList extends React.PureComponent
{
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            error: null
        };

        this._renderItem           = this._renderItem.bind(this);
        this._loadRepositoryData   = this._loadRepositoryData.bind(this);
        this._loadWatchList        = this._loadWatchList.bind(this);
        this._deleteRepositoryData = this._deleteRepositoryData.bind(this);
    }

    componentDidMount() {
        this._loadWatchList();
    }

    async reloadList() {
        this._loadWatchList();
    }

    async _loadWatchList() {
        try {
            const result = await getWatchList();
            this.setState({
                list: result.body.collections
            });
        } catch (error) {
            this.setState({ error });
        }
    }

    _loadRepositoryData(repository) {
        this.props.socket.emit('scrap', { url: repository.url });
    }

    async _deleteRepositoryData(repository) {
        if (confirm(`Are you sure you want to stop watching ${repository.repository}?`)) {
            try {
                const result = await removeFromList(repository.repository);
                this._loadWatchList();
            } catch (error) {
                this.setState({ error })
            }
        }
    }

    _renderItem(repository) {
        return (
            <WatchListItem key={repository.repository} 
                            data={repository} 
                            onLoad={this._loadRepositoryData} 
                            onDelete={this._deleteRepositoryData} />
        )
    }

    _renderAlert() {
        if (this.state.error) {
            return (<Alert color="alert">{this.state.error}</Alert>);
        }
    }

    render() {
        const { list } = this.state;
        return (
            <div className="watch-list">
                {this._renderAlert()}
                <h4>Watch List</h4>
                <ListGroup>{ list.map(this._renderItem) }</ListGroup>
            </div>
        )
    }
}

export default WatchList;