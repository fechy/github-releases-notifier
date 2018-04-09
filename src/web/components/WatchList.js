import React from 'react';
import PropTypes from 'prop-types';

import { Alert, ListGroup, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import { getWatchList, removeFromList } from '../actions';

import WatchListItem from './WatchListItem';

class WatchList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            error: null,
            modal: null
        };

        this._ignoreModal = this._ignoreModal.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._loadRepositoryData = this._loadRepositoryData.bind(this);
        this._loadWatchList = this._loadWatchList.bind(this);
        this._deleteRepositoryData = this._deleteRepositoryData.bind(this);
    }

    componentDidMount() {
        this._loadWatchList();
    }

    _ignoreModal() {
        this.setState({ modal: null });
    }

    _showRemoveModal(repository) {
        const newModal = {
            repository: repository.repository,
            onConfirm: this._deleteRepositoryData.bind(this, repository)
        };

        this.setState({ modal: newModal });
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
        const { modal } = this.state;
        if (!modal) {
            this._showRemoveModal(repository);
            return;
        }

        try {
            await removeFromList(repository.repository);
            this.setState({ modal: null });
            this._loadWatchList();
        } catch (error) {
            this.setState({ error, modal: null });
        }
    }

    _renderItem(repository) {
        return (
            <WatchListItem
                key={repository.repository}
                data={repository}
                onLoad={this._loadRepositoryData}
                onDelete={this._deleteRepositoryData}
            />
        );
    }

    _renderAlert() {
        return (this.state.error && <Alert color="alert">{this.state.error}</Alert>);
    }

    _renderModal() {
        const { modal } = this.state;
        if (modal) {
            return (
                <Modal isOpen={this.state.modal !== null}>
                    <ModalHeader>Remove Repository</ModalHeader>
                    <ModalBody style={{ textAlign: 'center' }}>
                        <div>Are you sure you want to stop watching {modal.repository}?</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="info" onClick={this._ignoreModal}>CANCEL</Button>
                        <Button color="danger" onClick={modal.onConfirm}>CONFIRM</Button>
                    </ModalFooter>
                </Modal>
            );
        }

        return null;
    }

    render() {
        const { list } = this.state;
        return (
            <React.Fragment>
                {this._renderModal()}
                <div className="watch-list">
                    {this._renderAlert()}
                    <h4>Watch List</h4>
                    <ListGroup>{ list.map(this._renderItem) }</ListGroup>
                </div>
            </React.Fragment>
        );
    }
}

WatchList.propTypes = {
    socket: PropTypes.instanceOf(Object).isRequired,
};

export default WatchList;