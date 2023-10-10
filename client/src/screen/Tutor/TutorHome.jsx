import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage,FieldArray } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import axios from "../../axios"
import {useNavigate} from "react-router-dom";

function TutorHome() {
  const navigate = useNavigate();
  const initialValues = {
    subjects: [
      {
        name: '',
        slots: [],
      },
    ],
  };
  
  

  const validationSchema = Yup.object().shape({
    subjects: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Subject name is required'),
        slots: Yup.array()
          .min(1, 'At least one slot is required')
          .test('slots', 'Selected slots are conflicting', function (slots) {
            for (let i = 0; i < slots.length; i++) {
              for (let j = i + 1; j < slots.length; j++) {
                if (slots[i] === slots[j]) {
                  return false;
                }
              }
            }
            return true;
          }),
      })
    ),
  });

  const options = [
    { value: '9:00', label: '9am' },
    { value: '10:00', label: '10am' },
    { value: '11:00', label: '11am' },
    { value: '12:00', label: '12am' },
    // Add more options as needed
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Handle form submission
        console.log(values);
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray
            name="subjects"
            render={({ push, remove }) => (
              <div>
                
                {values.subjects.map((subject, index) => (
                  <div key={index}>
                    <div>
                      <label htmlFor={`subjects[${index}].name`}>Subject Name:</label>
                      <Field name={`subjects[${index}].name`} />
                      <ErrorMessage name={`subjects[${index}].name`} component="div" className="error" />
                    </div>
                    <div>
                      <label>Slots:</label>
                      <Select
                        options={options}
                        isMulti
                        value={subject.slots.map((slot) => ({ value: slot, label: slot }))}
                        onChange={(selectedOptions) => {
                          const selectedSlots = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          values.subjects[index].slots = selectedSlots;
                        }}
                      />
                      <ErrorMessage name={`subjects[${index}].slots`} component="div" className="error" />
                    </div>
                    <button type="button" onClick={() => remove(index)}>
                      Remove Subject
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => push({ name: '', slots: [] })}>
                  Add Subject
                </button>
              </div>
            )}
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default TutorHome
