import React from 'react';
import request from 'superagent';
import classnames from 'classnames';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
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

    _checkWorkerTime() {
        request.get('/api/cron-time')
                .end((err, res) => {
                    this.setState({ 
                        error: err, 
                        code: res.body.code,
                        status: res.body.status, 
                        next_execution: moment(res.body.next).format(DATE_FORMAT)
                    });
                });
    }

    _handleChangeCronTime() {
        const value = this.input.getValue();
        request.post('/api/cron-time', { time: value })
        .end((err, res) => {
            this.setState({ 
                error: err, 
                status: res.body.status,
                code: res.body.code, 
                next_execution: moment(res.body.next).format(DATE_FORMAT),
                modal_opened: false
            });
        });
    }

    render() {
        const codeForUrl = this.state.code.split(/\s/).join('_');
        return (
            <div>
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
                <Alert className="worker-container">
                    <div className={classnames("worker-status", this.state.status ? "running" : "stopped")} />
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