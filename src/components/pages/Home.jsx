import React, {useState} from "react";
import * as Yup from "yup";
import {Formik, Form} from "formik";
import _ from "lodash";
import InputBox from "./../common/InputBox";
import SelectBox from "./../common/SelectBox";
import {findAnswer} from "./../../utils/operations";

let validation = Yup.string()
  .required()
  .matches(/^[0-9,]+$/, "Only elements seperated by commas allowed")
  .test({
    name: "duplicate",
    test: (values, params) => {
      if (values) {
        let invalidNos;
        if (values[values.length - 1] == ",") {
          values = values.substring(0, values.length - 1);
        }
        let roomNos = values.split(",");

        roomNos.forEach(no => {
          if (no == "") invalidNos = true;
        });

        if (invalidNos)
          return params.createError({
            message: "Comma(, ,) without a number between is not allowed",
          });

        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);

        let duplicateVal = findDuplicates(roomNos);

        if (_.isEmpty(duplicateVal)) return true;
        else return params.createError({message: "Repeated Elements!"});
      }
    },
  });

const validationSchema = Yup.object().shape({
  A: validation,
  B: validation,
});

function HomePage() {
  const [result, setResult] = useState("");
  const [a, setA] = useState();
  const [b, setB] = useState();
  const [operation, setOperation] = useState("");

  const handleSubmit = async (values, setFieldError) => {
    let a = "{" + JSON.stringify(values["A"]) + "}";
    a = JSON.stringify(a).replaceAll('"', "").replaceAll("\\", "");
    let b = "{" + JSON.stringify(values["B"]) + "}";
    b = JSON.stringify(b).replaceAll('"', "").replaceAll("\\", "");
    setA(a);
    setB(b);
    setOperation(values["operation"]);
    a = values["A"].split(",");
    b = values["B"].split(",");
    let output = JSON.stringify(findAnswer(a, b, values["operation"]))
      .replaceAll("[", "{")
      .replaceAll("]", "}")
      .replaceAll('"', "");
    setResult(output);
  };

  return (
    <Formik
      initialValues={{
        A: "",
        B: "",
        operation: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, {setFieldError}) => handleSubmit(values, setFieldError)}
    >
      {({errors, touched, values, handleChange, handleBlur}) => (
        <>
          <Form>
            <h3 style={{textAlign: "center"}}>Set Operations</h3>
            <div style={{margin: "auto", width: "50%"}}>
              <div className="form-group">
                <InputBox
                  error={errors}
                  handleBlur={handleBlur}
                  touched={touched}
                  label="A"
                  values={values}
                  type="text"
                  name="A"
                  placeholder="Enter elements of A"
                  handleChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <InputBox
                  error={errors}
                  handleBlur={handleBlur}
                  touched={touched}
                  label="B"
                  values={values}
                  type="text"
                  name="B"
                  placeholder="Enter elements of B"
                  handleChange={handleChange}
                  className="form-control"
                />
              </div>
              <br />
              <div className="form-group">
                <SelectBox
                  label="Select Operation"
                  name="operation"
                  options={[null, "AxB", "A-B", "B-A", "A∪B", "A∩B"]}
                />
              </div>
              <br />
              <button type="submit" className="btn btn-primary btn-block">
                Find
              </button>
            </div>
          </Form>
          {operation && (
            <p style={{fontSize: "30px", fontStyle: "bold", textAlign: "center"}}>
              A= {a}
              <br />
              B= {b}
              <br />
            </p>
          )}
          {operation && (
            <p style={{textAlign: "center", fontSize: "30px"}}>
              <span>{operation}</span> = <span style={{fontSize: "30px"}}>{result}</span>
            </p>
          )}
        </>
      )}
    </Formik>
  );
}

export default HomePage;
