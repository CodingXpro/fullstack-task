"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../InquiryFormCont/inquiry-form.css";
import { toast, ToastContainer } from "react-toastify";

function ConnectForm() {
  interface IFormValues {
    name: string;
    email: string;
    country: string;
    phoneNumber: string;
    description: string; // Add this line
  }
  const initialValues: IFormValues = {
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    description: "",
  };

  const validate = (values: any) => {
    const errors: any = {};
    //regex code is also here.

    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.name) {
      errors.name = "User Name is Req";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (isNaN(Number(values.phoneNumber))) {
      errors.phoneNumber = "Invalid phone number";
    } else if (values.phoneNumber.toString().length > 10) {
      errors.phoneNumber = "Phone number must be more than 10 digits";
    }

    if (!values.country) {
      errors.country = "Select any Country";
    }

    return errors;
  };

  const handleSubmit = (
    values: any,
    actions: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    // if ()
    console.log(values);
    toast.success("Form SuccessFully Submitted");

    setTimeout(() => {
      actions.setSubmitting(false);
    }, 0);
  };

  const handleCountryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCountry = event.target.value;
    console.log("SELECTED COUNTRY FOR API CALL ", selectedCountry);
    console.log("SELECTED COUNTRY ", event.target);
  };
  return (
    <div className="pl-[20px]">
      <ToastContainer />

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          isValid,
          dirty,
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            {touched.name && errors.name && (
              <p className="inquiry-form-error">{errors.name}</p>
            )}
            <div className="inquiry-ip-cont">
              <input
                className="inquiry-form-input"
                name="name"
                type="text"
                placeholder="Name"
                value={values?.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {touched.email && errors.email && (
              <p className="inquiry-form-error">{errors.email}</p>
            )}
            <div className="inquiry-ip-cont">
              <input
                className="inquiry-form-input"
                name="email"
                type="text"
                placeholder="Business Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {touched.country && errors.country && (
              <p className="inquiry-form-error">{errors.country}</p>
            )}
            <div className="inquiry-ip-cont">
              <select
                // Dropdown Need to change it
                className="inquiry-form-input"
                name="country"
                value={values.country}
                onChange={(event) => {
                  handleChange(event); // Update form state
                  handleCountryChange(event); // Make API call
                }}
                onBlur={handleBlur}
              >
                <option value="">Select Country</option>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
              </select>
            </div>

            {touched.phoneNumber && errors.phoneNumber && (
              <p className="inquiry-form-error">{errors.phoneNumber}</p>
            )}
            <div className="inquiry-ip-cont">
              <input
                className="inquiry-form-input"
                name="phoneNumber"
                type="number"
                placeholder="Phone"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className="inquiry-ip-cont h-[74px]">
              <textarea
                name="description"
                value={values?.description}
                placeholder="To assist you better, please share your research needs"
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
            </div>

            {/* Different Section as it is for Security Code */}

            <div>
              <button
                className="new-btn-cont"
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
              >
                Send
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ConnectForm;
