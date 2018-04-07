import React from 'react';
import { Jumbotron } from 'reactstrap';

class FeedData extends React.PureComponent
{
    _renderFeed() {
        const { feed, loading } = this.props;
        if (!feed) {
            return loading ? <span>Loading...</span> : <span>Nothing to show</span>
        }

        return (
            <React.Fragment>
                <div><strong>Last update:</strong> {feed.updated_at}</div>
                <div>
                    <div><strong>Title:</strong> {feed.last_entry.title}</div>
                    <div><strong>Link:</strong> <a href={`https://github.com${feed.last_entry.link}`} target="_blank">{feed.last_entry.link}</a></div>
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <Jumbotron className="data-container">
                <h3><strong>Repository information:</strong></h3>
                {this._renderFeed()}
            </Jumbotron>
        )
    }
}
//
export default FeedData;