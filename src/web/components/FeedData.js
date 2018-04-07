import React from 'react';

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
            <div className="data-container">
                <div><strong>Repository information:</strong></div>
                {this._renderFeed()}
            </div>
        )
    }
}
//
export default FeedData;