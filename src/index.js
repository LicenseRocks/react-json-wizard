import React, { useState } from "react";
import styled from "styled-components";
import { FormProvider, useForm } from "react-hook-form";
import {
  AppContainer,
  RocksKitIcons,
  RocksKitTheme,
  Wizard,
} from "@licenserocks/kit";

import { Form } from "./components";
import { Icons } from "./theme";
import { MegaFlowPropTypes, MegaFlowDefaultProps } from "./props";

const Wrapper = styled.div``;

const MegaFlow = ({
  schema,
  onFinish,
  onStepSubmit,
  wizardProps,
  wrapperProps,
}) => {
  // Parse if schema was type of JSON string
  const parsedSchema = typeof schema === "string" ? JSON.parse(schema) : schema;

  const { steps } = parsedSchema;
  const [currentStep, setCurrentStep] = useState(0);
  const isCurrentLastStep = currentStep === steps.length - 1;
  const [wizardData, setWizardData] = useState({});

  const methods = useForm({
    mode: "onBlur",
    defaultValues: wizardData,
  });

  const onSubmit = (data) => {
    // Set step data in global wizard object
    setWizardData((prev) => ({
      ...prev,
      ...data,
    }));

    // Send step data to props
    if (onStepSubmit) onStepSubmit(data);

    if (!isCurrentLastStep) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onFinish(wizardData);
    }
  };

  const stepsArray = steps.map((st) => st.title);

  const renderForm = () => (
    <Form
      data={steps[currentStep]}
      stepIndex={currentStep}
      wizardData={wizardData}
    />
  );

  return (
    <AppContainer icons={{ ...RocksKitIcons, ...Icons }} theme={RocksKitTheme}>
      <Wrapper {...wrapperProps}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Wizard
              currentStepContent={renderForm()}
              currentStepIndex={currentStep}
              setCurrentStepIndex={setCurrentStep}
              steps={stepsArray}
              {...wizardProps}
            />
          </form>
        </FormProvider>
      </Wrapper>
    </AppContainer>
  );
};

MegaFlow.propTypes = MegaFlowPropTypes;

MegaFlow.defaultProps = MegaFlowDefaultProps;

export default MegaFlow;