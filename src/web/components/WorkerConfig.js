import React from 'react';
import request from 'superagent';
import classnames from 'classnames';
import moment from 'moment';
import ReactModal from 'react-modal';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'

import Input from '../components/Input';

const cronCheckTimeInterval = 60000; // every minute

ReactModal.setAppElement('#root');

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const validateCron = function (entry) {
    return /^(?:[1-9]?\d|\*)(?:(?:[\/-][1-9]?\d)|(?:,[1-9]?\d)+)?$/.test(entry);
};

const DATE_FORMAT = 'LLLL';

class WorkerConfig extends React.PureComponent
{
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
        const value = this.refs.input.getValue();
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
        return (
            <div className="worker-container">
                <ReactModal isOpen={this.state.modal_opened}
                    contentLabel="Example Modal"
                    ariaHideApp={true}
                    onRequestClose={() => this.setState({ modal_opened: false })}
                    shouldCloseOnEsc={true}
                    style={customStyles}
                >
                    <div className="dialog-body">
                        <h1>Edit Schedule</h1>
                        <Input ref="input"
                               value={this.state.code} 
                               placeholder={'* * * * *'} 
                               validator={validateCron}
                        />
                        <button onClick={this._handleChangeCronTime}>SET</button>
                    </div>
                </ReactModal>
                <div className={classnames("worker-status", this.state.status ? "running" : "stopped")} />
                <div className="worker-data">Next execution scheduled: {this.state.next_execution}</div>
                <button onClick={() => this.setState({ modal_opened: true })} >
                    <FontAwesomeIcon icon={faEdit} className="btn-icon" />
                </button>
            </div>
        )
    }
}

export default WorkerConfig;