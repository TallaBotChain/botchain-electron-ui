import React from 'react';
import { FormGroup, ControlLabel, FormControl, Radio } from 'react-bootstrap';

export const inputField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => (
  <FormGroup controlId={input.name}>
    <FormControl {...input} placeholder={placeholder || label} type={type} readOnly={readOnly} className={touched && error && 'error'} />
      {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
      {asyncValidating && (<span>validating...</span>)}
      {appendComponent}
    <ControlLabel>{label}</ControlLabel>
  </FormGroup>
)

export const radioField = ({ input, label, type }) => (
  <div className='radio'>
    <label>
      <input {...input} type={type} />
      <span>{label}</span>
    </label>
  </div>
)

export const fileField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => {
  delete input.value
  return (
    <FormGroup controlId={input.name}>
      <FormControl {...input} type={type} />
      {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
      {asyncValidating && (<span>validating...</span>)}
      {appendComponent}
      <ControlLabel className="btn small-button default-button">{label}</ControlLabel>
      <small className="gray-label">{placeholder}</small>
    </FormGroup>
  );
}

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
    {touched && ((error && <div className='validation-error'>{error}</div>) || (warning && <div>{warning}</div>))}
    {asyncValidating && (<div>validating...</div>)}
    {appendComponent}
  </div>
)
