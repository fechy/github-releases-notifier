import React from 'react';
import request from 'superagent';
import classnames from 'classnames';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faStop from '@fortawesome/fontawesome-free-solid/faStop';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import { Alert, Button } from 'reactstrap';

class BotStatus extends React.PureComponent
{
    constructor(props) {
        super(props);

        this.state = {
            status: false
        };

        this._handleGetStatus = this._handleGetStatus.bind(this);
        this._handleStartBot = this._handleStartBot.bind(this);
        this._handleStopBot = this._handleStopBot.bind(this);
    }

    componentDidMount() {
        this._handleGetStatus();
        setInterval(this._handleGetStatus, 10000);
    }

    async _handleGetStatus() {
        try {
            const result = await request.get('/api/bot-status');
            this.setState({ status: result.body.status });
        } catch (err) {
            console.error(err);
        }
    }

    async _handleStartBot() {
        try {
            const result = await request.get('/api/bot-start');
            this.setState({ status: result.body.status });
        } catch (err) {
            console.error(err);
        }
    }

    async _handleStopBot() {
        try {
            const result = await request.get('/api/bot-stop');
            this.setState({ status: result.body.status });
        } catch (err) {
            console.error(err);
        }
    }

    renderButtons() {
        if (this.state.status) {
            return (
                <Button color="primary" onClick={this._handleStopBot} >
                    <FontAwesomeIcon icon={faStop} className="btn-icon" />
                </Button>
            )
        }

        return (
            <Button color="primary" onClick={this._handleStartBot} >
                <FontAwesomeIcon icon={faPlay} className="btn-icon" />
            </Button>
        )
    }

    render () {
        return (
            <Alert color="info" className="worker-container">
                <div className={classnames("worker-status", this.state.status ? "running" : "stopped")} />
                <div className="worker-data">Telegram bot is {this.state.status ? 'running' : 'not running'}</div>
                {this.renderButtons()}
            </Alert>
        )
    }
}

export default BotStatus;