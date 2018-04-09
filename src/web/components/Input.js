import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Input extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || "",
            isValid: true
        };

        this._handleOnChange = this._handleOnChange.bind(this);
    }

    getValue() {
        return this.state.value;
    }

    _handleOnChange(e) {
        const { validator } = this.props;
        const { value } = e.target;
        const isValid = validator ? validator(value) : true;

        this.setState({ value, isValid });
    }

    clearValue() {
        this.setState({ value: '' });
    }

    render() {
        const { className } = this.props;
        const { isValid, value } = this.state;

        const classes = classnames("input-url", !isValid && value !== "" ? "invalid" : null, className);

        return (
            <input
                type="text"
                className={classes}
                value={value}
                onChange={this._handleOnChange}
                placeholder={this.props.placeholder}
            />
        );
    }
}

Input.defaultProps = {
    value: '',
    placeholder: '',
    className: null,
    validator: null
};

Input.propTypes = {
    value: PropTypes.string,
    validator: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default Input;