import React from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Alert } from 'reactstrap';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faEye from '@fortawesome/fontawesome-free-solid/faEye';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class FeedData extends React.PureComponent {
    _renderData() {
        const { data } = this.props;
        return (
            <div>
                <h5>Latest release:</h5>
                <div><strong>Title:</strong> {data.feed.last_entry.title}</div>
                <div><strong>Link:</strong> <a href={`https://github.com${data.feed.last_entry.link}`} target="_blank">{data.feed.last_entry.link}</a></div>
            </div>
        );
    }

    _renderFeed() {
        const { data, loading } = this.props;
        if (!data.feed) {
            return loading ? <span>Loading...</span> : <span>Nothing to show</span>;
        }

        const { entries, updated_at, url } = data.feed;

        return (
            <React.Fragment>
                <div><strong>Last update:</strong> {updated_at}</div>
                <hr />
                {entries > 0 ? this._renderData() : <Alert color="warning">This repository doesnt have any published release yet</Alert>}
                <hr />
                <div>
                    <div>
                        <strong>Repository URL</strong>: <a href={url} target="_blank" >{url}</a>
                    </div>
                    {this._renderWatchedData()}
                </div>
            </React.Fragment>
        );
    }

    _renderWatchedIcon() {
        return this.props.data.internal && <FontAwesomeIcon icon={faEye} />;
    }

    _renderWatchedData() {
        if (this.props.data.internal) {
            const { last_check_at } = this.props.data.internal;

            const lastCheckDateToShow = last_check_at ? moment(last_check_at).format(DATE_FORMAT) : 'Never';
            return (
                <div>
                    <div><strong>Last check:</strong> {lastCheckDateToShow} </div>
                </div>
            );
        }

        return null;
    }

    render() {
        if (!this.props.data) {
            return (
                <Jumbotron className="data-container">Nothing loaded</Jumbotron>
            );
        }

        const { feed } = this.props.data;

        return (
            <Jumbotron className="data-container">
                <h4><strong>Repository:</strong> {feed.repository} {this._renderWatchedIcon()}</h4>
                {this._renderFeed()}
            </Jumbotron>
        );
    }
}

FeedData.defaultProps = {
    data: null,
    loading: false,
};

FeedData.propTypes = {
    data: PropTypes.instanceOf(Object),
    loading: PropTypes.bool
};

export default FeedData;