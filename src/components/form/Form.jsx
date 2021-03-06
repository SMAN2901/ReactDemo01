import React, { Component } from "react";
import Joi from "joi-browser";
import "./Form.css";

class Form extends Component {
    state = {
        data: {},
        errors: {}
    };

    validateForm = () => {
        const joiOptions = { abortEarly: false };
        const { error } = Joi.validate(
            this.state.data,
            this.schema,
            joiOptions
        );

        if (!error) return null;

        const errors = {};
        error.details.forEach(item => {
            errors[item.path[0]] = item.message;
        });

        return errors;
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "confirmPassword") {
            return value !== this.state.data.password
                ? "Password doesn't match"
                : null;
        }

        return error ? error.details[0].message : null;
    };

    onSubmit = event => {
        event.preventDefault();
        const error = this.validateForm();
        this.setState({ errors: error || {} });

        if (!error) return this.submitForm();
    };

    onChange = ({ currentTarget: input }) => {
        const errorMessage = this.validateField(input);
        const { data, errors } = { ...this.state };

        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        data[input.name] = input.value;

        this.setState({ data, errors });
    };

    renderInput = (name, label, classes, type = "text") => {
        const { data, errors } = this.state;
        classes = "form-input " + classes;

        return (
            <div className="input-container">
                <input
                    value={data[name]}
                    name={name}
                    placeholder={label}
                    className={classes}
                    type={type}
                    onChange={this.onChange}
                />
                <div className="error-container">
                    <p className="error-text">{errors[name]}</p>
                </div>
            </div>
        );
    };

    renderButton = (label, classes, ref = null) => {
        const { errors } = this.state;
        classes = "form-button " + classes;

        return (
            <button
                className={classes}
                onClick={this.onSubmit}
                disabled={Object.keys(errors).length}
                ref={ref}
            >
                {label}
            </button>
        );
    };

    renderSelectBox = (name, label, classes, options) => {
        const { data, errors } = this.state;
        classes = "form-select " + classes;

        return (
            <div className="input-container">
                <label className="input-label">{label}</label>
                <select
                    value={data[name]}
                    name={name}
                    className={classes}
                    onChange={this.onChange}
                >
                    {options.map(item => (
                        <option
                            key={item.value}
                            value={item.value}
                            className="form-select-option"
                        >
                            {item.text}
                        </option>
                    ))}
                </select>
                <div className="error-container">
                    <p className="error-text">{errors[name]}</p>
                </div>
            </div>
        );
    };

    renderDateField = (name, label, classes, min) => {
        const { data, errors } = this.state;
        classes = "form-input " + classes;

        return (
            <div className="input-container">
                <label className="input-label">{label}</label>
                <input
                    type="date"
                    name={name}
                    value={data[name]}
                    className={classes}
                    min={min}
                    onChange={this.onChange}
                />
                <div className="error-container">
                    <p className="error-text">{errors[name]}</p>
                </div>
            </div>
        );
    };
}

export default Form;
