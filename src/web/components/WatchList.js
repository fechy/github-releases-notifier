import React from 'react';
import moment from 'moment';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'

import { getWatchList, removeFromList } from '../actions';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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
            <li key={`item-${repository.repository.replace('/', '_')}`}>
                <div className="item-data">
                    <h3>{repository.repository}</h3>
                    <small><strong>Last Update:</strong> {moment(repository.last_updated).format(DATE_FORMAT)}</small>
                    <small><strong>Last Check:</strong> {repository.last_check_at ? moment(repository.last_check_at).format(DATE_FORMAT) : 'never' }</small>
                </div>
                <button className="list-btn btn-load" onClick={ () => this._loadRepositoryData(repository) }>
                    <FontAwesomeIcon icon={faInfoCircle} className="btn-icon" />
                </button>
                <button className="list-btn btn-delete" onClick={ () => this._deleteRepositoryData(repository) }>
                    <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                </button>
            </li>
        )
    }

    render() {
        const { list, error } = this.state;
        return (
            <div className="watch-list">
                <div>{error}</div>
                <ul>
                    {list.map(this._renderItem)}
                </ul>
            </div>
        )
    }
}

export default WatchList;