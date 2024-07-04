window.addEventListener("DOMContentLoaded", () => {
  // Forms
  const businessFormStepsSC = [
    "policyholder_form",
    "business_information",
    "policy_coverage_options",
    "coverage_history_form",
  ];

  // *********************************************
  //       FORM SUBMISSION AND STEP HANDLING
  // *********************************************

  let businessStepSC = 0;
  let businessMaxStepSC = formListSC?.length - 1;

  const businessNextBtnSC = document.querySelector(".businessNextBtnSC");
  const businessBackBtnSC = document.querySelector(".businessBackBtnSC");

  // ***** NEXT FUNCTIONALITY *****
  pressEnterToSubmitSC(businessNextBtnSC);

  businessNextBtnSC?.addEventListener("click", async () => {
    if (businessStepSC === 0) {
      const isSelectEligibility = eligibilityValidationSC(businessFormStepsSC);
      if (!Boolean(isSelectEligibility)) return false;

      businessMaxStepSC = formListSC?.length - 1;
      militaryFormFuncSC();
      formDataSC.IsStepOne = false;
    }

    //   If additional form has in arrayList
    if (businessStepSC === formListSC?.indexOf("military_information")) {
      if (!militaryValidationSC()) return false;
    }

    if (businessStepSC === formListSC?.indexOf("parent_information")) {
      if (!validateFormSC("parent_information")) return false;
    }

    if (businessStepSC === formListSC?.indexOf("child_information")) {
      if (!validateFormSC("child_information")) return false;
    }

    if (businessStepSC === formListSC?.indexOf("policyholder_form")) {
      if (!policyholderValidationSC(businessStepSC)) return false;

      // Save Data
      const resData = await saveBusinessSC("policyholder_form");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
    }

    if (businessStepSC === formListSC?.indexOf("business_information")) {
      if (!validateFormSC("business_information")) return false;

      // Save Data
      formDataSC.IsStepOne = true; // contact info is here

      const resData = await saveBusinessSC(
        "business_information",
        "send",
        "business"
      );
      // const resData = await saveBusinessSC("business_information");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
    }

    if (businessStepSC === formListSC?.indexOf("policy_coverage_options")) {
      policyCoverageOptionsSCDisable(true);

      if (!policyCoverageOptionsSC()) {
        policyCoverageOptionsSCDisable(false);
        return false;
      }

      policyCoverageOptionsSCDisable(false);
      coverageHistoryFuncSC();

      // Save Data
      const resData = await saveBusinessSC();
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
    }

    if (businessStepSC === formListSC?.indexOf("coverage_history_form")) {
      const isAllFine = validateFormSC("coverage_history_form");

      if (isAllFine) {
        // Save Data
        document.querySelector(".SaveDataSC").click();
        const resData = await saveBusinessSC("coverage_history_form", "submit");
        if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

        // Go to Thank You Page
        // window.location.href = businessSuccessRedirectionSC;
      }
    }

    // Step Increment
    businessStepSC >= businessMaxStepSC ? businessStepSC : businessStepSC++;

    // Show Form
    showActiveFormSC(businessStepSC, businessBackBtnSC);
  });

  // Back
  businessBackBtnSC?.addEventListener("click", () => {
    // Step Decrement
    businessStepSC <= 0 ? businessStepSC : businessStepSC--;

    showActiveFormSC(businessStepSC, businessBackBtnSC);
  });

  async function saveBusinessSC(form, action = "send", addressValid = null) {
    const resData = await saveDataSC(
      "/sc-api/forms/save-business",
      formDataSC,
      businessNextBtnSC,
      form,
      action,
      addressValid
    );

    return resData;
  }
  // *********************************************
  //              FORM VALIDATION
  // *********************************************
  /*
   *
   * Note: Most of the form validate by using common validation functions from formCommon.js file.
   *
   */

  // ********** MULTI-STEP 3 Validation ***********
  function policyCoverageOptionsSC() {
    // const typeOfInsurance = document.getElementsByName("typeOfInsurance");
    const typeOfInsurance = document.querySelectorAll(
      '.cover_options_wrapper .field__input[data-sc-field-name="typeOfInsurance"]'
    );

    formDataSC[typeOfInsurance[0].dataset.scFieldName] = [];

    typeOfInsurance.forEach((item) => {
      if (item?.checked) {
        formDataSC[typeOfInsurance[0].dataset.scFieldName].push(item?.value);
      }
    });

    // const isValidate = formDataSC[typeOfInsurance[0].name].length > 0;
    // Error Message if value = null
    // if (!isValidate) {
    //   eligibilityErrorMessageSC(false, ".multi__step_3 .field_message");
    // }

    return true;
  }

  // ******************* policyCoverageOptionsSC Disable *******************
  function policyCoverageOptionsSCDisable(disableStatus) {
    // const fieldGroups = document.querySelectorAll(
    //   ".cover_options_wrapper .field-group"
    // );
    // fieldGroups.forEach((group) => {
    //   const field = group.querySelector("input");
    //   const label = group.querySelector("label");

    //   field.disabled = disableStatus;
    //   label.style.opacity = disableStatus ? "0.5" : "1";
    // });

    const fieldInputs = document.querySelectorAll(
      ".cover_options_wrapper .field__input"
    );

    fieldInputs.forEach((field) => {
      const label = field.parentElement;

      field.disabled = disableStatus;
      label.style.opacity = disableStatus ? "0.5" : "1";
    });
  }
});

// Custom Button added on the SITECORE FROM
const btnBack = document.createElement("button");
btnBack.type = "button";
btnBack.className = "button button__back button__left businessBackBtnSC hide";
btnBack.textContent = "Back";

const btnNext = document.createElement("button");
btnNext.type = "button";
btnNext.className = "button button__next button__right businessNextBtnSC";
btnNext.textContent = "Next";

document
  .querySelector(".quote_request__action_buttons.business_sitecore .container")
  .appendChild(btnBack);
document
  .querySelector(".quote_request__action_buttons.business_sitecore .container")
  .appendChild(btnNext);
