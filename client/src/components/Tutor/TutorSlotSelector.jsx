import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options = [
    { value: '9:00', label: '9am' },
    { value: '10:00', label: '10am' },
    { value: '11:00', label: '11am' },
    { value: '12:00', label: '12pm' },
    { value: '13:00', label: '1pm' },
    { value: '14:00', label: '2pm' },
    { value: '15:00', label: '3pm' },
    { value: '16:00', label: '4pm' },
    { value: '17:00', label: '5pm' },
    { value: '18:00', label: '6pm' },
    { value: '19:00', label: '7pm' },
    { value: '20:00', label: '8pm' },
    { value: '21:00', label: '9pm' },
  ]
function TutorSlotSelector({formik2,setOpenSlotSelect}) {
    const animatedComponents = makeAnimated();
  return (
    <div className="tutor-course-slot">
          <form onSubmit={formik2.handleSubmit}>
            <i className="fa-solid fa-xmark" onClick={()=>{setOpenSlotSelect(false)}}></i>
            Select the Slot 
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options}
              value={formik2.values.selectedSlots}
              onChange={(selectedOption) => {
                
                  formik2.setFieldValue('selectedSlots', selectedOption );
              
              }}
              styles={{
                multiValue: (provided) => ({
                  ...provided,
                  display: 'inline-grid',
            
                  // Occupies the row
                  // margin: '2px', // Adds some spacing between values
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  whiteSpace: 'nowrap', // Prevents the label from breaking into a new line
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  cursor: 'pointer',
                }),
              }}
            />
          {formik2.errors.selectedSlots  ? <p>{formik2.errors.selectedSlots}</p>:null}
          <button type="submit">Confirm</button>
          </form>
        </div>
  )
}

export default TutorSlotSelector
