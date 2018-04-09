import React from 'react';
import request from 'superagent';
import classnames from 'classnames';
import moment from 'moment';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faClock from '@fortawesome/fontawesome-free-solid/faClock'

import { Alert, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import Input from '../components/Input';

const cronCheckTimeInterval = 60000; // every minute

const validateCron = function (entry) {
    return /^(?:[1-9]?\d|\*)(?:(?:[\/-][1-9]?\d)|(?:,[1-9]?\d)+)?$/.test(entry);
};

const DATE_FORMAT = 'LLLL';

class WorkerConfig extends React.PureComponent
{
    input;

    constructor() {
        super();

        this.state = {
            status: false,
            error: null,
            code: "",
            next_execution: null,
            modal_opened: false
        };

        this._checkWorkerTime      = this._checkWorkerTime.bind(this);
        this._handleChangeCronTime = this._handleChangeCronTime.bind(this);
    }

    componentDidMount() {
        this._checkWorkerTime();
        setInterval(this._checkWorkerTime, cronCheckTimeInterval);
    }

    async _checkWorkerTime() {
        try {
            const response = await request.get('/api/cron-time');
            const { body } = response;
            this.setState({ 
                error: null, 
                code: body.code,
                status: body.status, 
                next_execution: moment(body.next).format(DATE_FORMAT)
            });
        } catch (err) {
            this.setState({ error: err.message });
        }
    }

    async _handleChangeCronTime() {
        const time = this.input.getValue();

        try {
            const response = await request.post('/api/cron-time', { time });
            const { body } = response;
            this.setState({ 
                error: null, 
                status: body.status,
                code: body.code, 
                next_execution: moment(body.next).format(DATE_FORMAT),
                modal_opened: false
            });
        } catch (err) {
            this.setState({ error: err.message });
        }
    }

    renderModal () {
        const codeForUrl = this.state.code.split(/\s/).join('_');
        return (
            <Modal isOpen={this.state.modal_opened}>
                <ModalHeader>Edit Schedule</ModalHeader>
                <ModalBody style={{ textAlign: 'center' }}>
                    <div>Enter a valid cron-like code</div>
                    <Input ref={ref => this.input = ref} className="text-center" value={this.state.code} placeholder={'* * * * *'} validator={validateCron} />
                    <div>
                        <small>You can check on <a href={`https://crontab.guru/#*_*_*_*_*`}>https://crontab.guru/#*_*_*_*_*</a> how to do it</small>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" onClick={() => this.setState({ modal_opened: false })}>CANCEL</Button>
                    <Button color="danger" onClick={this._handleChangeCronTime}>SET</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render() {
        return (
            <div>
                {this.renderModal()}
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                <Alert color="primary" className="worker-container">
                    
                    <div className={classnames("worker-status", this.state.status ? "running" : "stopped")}>
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    
                    <div className="worker-data">Next execution scheduled: {this.state.next_execution}</div>

                    <Button color="primary" onClick={() => this.setState({ modal_opened: true })} >
                        <FontAwesomeIcon icon={faEdit} className="btn-icon" />
                    </Button>
                </Alert>
            </div>
        )
    }
}

export default WorkerConfig;