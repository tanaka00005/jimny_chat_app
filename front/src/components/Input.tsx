import {UseFormRegister} from 'react-hook-form'

interface inputProps {
    label:string;
    fieldName:string;
    id:string;
    register:UseFormRegister
}

function Input({label,fieldName,id,register}:inputProps) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={fieldName} {...register(fieldName)} />
  
      </div>
    )
  }
  
  export default Input