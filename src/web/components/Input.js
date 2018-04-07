import React from 'react';
import classnames from 'classnames';

class Input extends React.PureComponent
{
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || "",
            isValid: true
        };

        this._handleOnChange = this._handleOnChange.bind(this);
    }

    _handleOnChange(e) {
        const { validator } = this.props;
        const value = e.target.value; 
        const isValid = validator ? validator(value) : true;

        this.setState({ value, isValid });
    }

    getValue() {
        return this.state.value;
    }

    clearValue() {
        this.setState({ value: '' });
    }

    render() {
        const { id, className } = this.props;
        const { isValid, value } = this.state;

        const classes = classnames("input-url", !isValid && value != "" ? "invalid" : null, className);

        return (
            <input type="text" 
                   className={classes}
                   value={value} 
                   onChange={this._handleOnChange}
                   placeholder={this.props.placeholder}
            />
        )
    }
}

export default Input;