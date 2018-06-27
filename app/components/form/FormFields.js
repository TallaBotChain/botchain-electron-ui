import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export const inputField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => (
  <FormGroup controlId={input.name}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...input} placeholder={placeholder || label} type={type} readOnly={readOnly}  />
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
    {asyncValidating && (<span>validating...</span>)}
    {appendComponent}
  </FormGroup>
)

export const textareaField = ({ input, label, readOnly, placeholder, meta: { asyncValidating, touched, error, warning } }) => (
  <div>
    <label htmlFor={input.name}>{label}</label>
    <textarea {...input} placeholder={placeholder || label} readOnly={readOnly} rows="12" />
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
)


export const checkboxField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => (
  <div className='checkbox'>
    <input {...input} placeholder={placeholder || label} type={type} id={input.name} />
    <label htmlFor={input.name}>{label}</label>
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
    {asyncValidating && (<span>validating...</span>)}
    {appendComponent}
  </div>
)
