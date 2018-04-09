import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import { ListGroupItem, Button, Tooltip } from 'reactstrap';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class WatchListItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        const { data, onLoad, onDelete } = this.props;

        const repoId = data.repository.replace('/', '_');
        const tooltipID = `tooltip-${repoId}`;

        return (
            <ListGroupItem key={`item-${repoId}`} id={tooltipID}>
                <div className="item-data">{data.repository}</div>
                <Button color="primary" onClick={() => onLoad(data)}>
                    <FontAwesomeIcon icon={faInfoCircle} className="btn-icon" />
                </Button>
                <Button color="danger" onClick={() => onDelete(data)}>
                    <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                </Button>
                <Tooltip target={tooltipID} isOpen={this.state.tooltipOpen} placement="top" toggle={this.toggle} innerClassName="watch-list-tooltip">
                    <small><strong>Last Check:</strong> {data.last_check_at ? moment(data.last_check_at).format(DATE_FORMAT) : 'never' }</small>
                </Tooltip>
            </ListGroupItem>
        );
    }
}

WatchListItem.propTypes = {
    data: PropTypes.instanceOf(Object).isRequired,
    onLoad: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default WatchListItem;