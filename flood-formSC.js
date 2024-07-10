window.addEventListener("DOMContentLoaded", () => {
  // Forms
  const floodFormStepsSC = [
    "policyholder_form",
    "property_quoted_form",
    "property_overview_form",
    "property_details_form",
  ];

  let floodStepSC = 0;
  let floodMaxStepSC = formListSC?.length - 1;

  const floodNextBtnSC = document.querySelector(".floodNextBtnSC");
  const floodBackBtnSC = document.querySelector(".floodBackBtnSC");

  // *********************************************
  //       FORM SUBMISSION AND STEP HANDLING
  // *********************************************

  // ***** NEXT FUNCTIONALITY *****
  pressEnterToSubmitSC(floodNextBtnSC);
  floodNextBtnSC?.addEventListener("click", async () => {
    if (floodStepSC === 0) {
      const isSelectEligibility = eligibilityValidationSC(floodFormStepsSC);
      if (!Boolean(isSelectEligibility)) return false;

      militaryFormFuncSC();
    }

    //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
    const submitResultSC = await handleFloodFormsSC(floodStepSC);
    if (!submitResultSC) return false;

    // Step Increment
    floodMaxStepSC = formListSC?.length - 1;
    floodStepSC >= floodMaxStepSC ? floodStepSC : floodStepSC++;

    // Show Form
    showActiveFormSC(floodStepSC, floodBackBtnSC);
  });

  // Back
  floodBackBtnSC?.addEventListener("click", () => {
    // Step Decrement
    floodStepSC <= 0 ? floodStepSC : floodStepSC--;

    showActiveFormSC(floodStepSC, floodBackBtnSC);
  });

  // =*********************************************
  //       HANDLING MULTI-STEP FORMS
  // =*********************************************
  async function handleFloodFormsSC(step) {
    // =*********************************************************
    if (step === formListSC?.indexOf("military_information")) {
      if (!militaryValidationSC()) return false;
    }

    if (step === formListSC?.indexOf("parent_information")) {
      if (!validateFormSC("parent_information")) return false;
    }

    if (step === formListSC?.indexOf("child_information")) {
      if (!validateFormSC("child_information")) return false;
    }

    if (step === formListSC?.indexOf("policyholder_form")) {
      if (!policyholderValidationSC(step, false)) return false;

      //const resData = await saveFloodSC("policyholder_form");
      // Save Data
      const resData = await saveFloodSC("policyholder_form", "send", "flood");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

      sisFfloodPropertyQuotedValidationSC();
    }
    if (step === formListSC?.indexOf("spouse_information")) {
      if (!validateFormSC("spouse_information")) return false;

      // Save Data
      const resData = await saveFloodSC("spouse_information");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;
    }

    if (step === formListSC?.indexOf("property_quoted_form")) {
      if (!floodPropertyQuotedValidation()) return false;

      // Save Data
      const resData = await saveFloodSC(
        "property_quoted_form",
        "send",
        "flood"
      );
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

      floodOverviewFuncSC();
    }

    if (step === formListSC?.indexOf("property_overview_form")) {
      if (!floodOverviewValidationSC()) return false;

      // Save Data
      const resData = await saveFloodSC("property_overview_form");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

      floodDetailsFuncSC();
    }

    //
    if (step === formListSC?.indexOf("property_details_form")) {
      if (!floodDetailsValidationSC()) return false;

      // Save Data
      const resData = await saveFloodSC("property_details_form", "submit");
      if (!resData || !resData.QuoteId || resData.QuoteId <= 0) return false;

      // Go to Thank You Page
      // window.location.href = floodSuccessRedirection;
    }

    return true;
  }

  async function saveFloodSC(form, action = "send", addressValid = null) {
    const resData = await saveDataSC(
      "/sc-api/forms/save-flood",
      formDataSC,
      floodNextBtnSC,
      form,
      action,
      addressValid
    );

    return resData;
  }

  // *********************************************
  //             STEP-1 VALIDATION
  // *********************************************

  // Policy Holder validation from formCommon.js (policyholderValidationSC)

  // Spouse validate by default validateFormSC in handleFloodFormsSC function

  // *********************************************
  // STEP-2 "Property to be Quoted" FUNCTIONALITY & VALIDATION
  // *********************************************
  const sisFloodSameAddressElSC = document.getElementsByClassName(
    "propertyAddressSameAsMailing--true"
  )[0];

  function sisFfloodPropertyQuotedValidationSC() {
    sisFloodSameAddressElSC.checked = false;
    //
    const floodQuotedMatchEl = document.querySelectorAll(
      ".property_quoted_form .field__input"
    );

    function setMatchedData(disability) {
      const floodHolderMatchEl = document.querySelectorAll(
        ".policyholder_form .field__input"
      );

      floodHolderMatchEl.forEach((element) => {
        const elementMatch = element.getAttribute("data-match");

        floodQuotedMatchEl.forEach((el) => {
          const elMatch = el.getAttribute("data-match");

          if (elMatch === elementMatch && elMatch && elementMatch)
            el.value = element.value;
          el.disabled = disability;
          sisFloodSameAddressElSC.disabled = false;

          // clear error if checked true
          if (disability) {
            removeErrorOnDisabledSC(el);
          }
        });
      });
    }

    setMatchedData(false);
    document.getElementsByClassName("propertyAddress")[0].value = "";

    // Same Mailing CheckBox Functionality
    sisFloodSameAddressElSC?.addEventListener("change", () => {
      if (sisFloodSameAddressElSC.checked) {
        setMatchedData(true);
      } else {
        floodQuotedMatchEl.forEach((el, i) => {
          el.value = "";
          el.disabled = false;

          if (i === 1) el.focus();
        });
      }
    });
  }

  function floodPropertyQuotedValidation() {
    const isValidate = validateFormSC("property_quoted_form");
    if (sisFloodSameAddressElSC?.checked) {
      formDataSC[sisFloodSameAddressElSC.dataset.scFieldName] = true;
      return true;
    } else {
      formDataSC[sisFloodSameAddressElSC.dataset.scFieldName] = false;
    }
    return isValidate;
  }

  // *********************************************
  // STEP-2 "Property Overview" FUNCTIONALITY & VALIDATION
  // *********************************************

  function floodOverviewFuncSC() {
    debugger;
    const awareOfFloodLossesOnProperty = document.querySelector(
      ".field__input [data-sc-field-name=awareOfFloodLossesOnProperty]:checked"
    );

    const howManyLossesHaveOccurred = document.getElementsByClassName(
      "howManyLossesHaveOccurred"
    )[0];

    document
      .querySelectorAll(
        ".field__input [data-sc-field-name=awareOfFloodLossesOnProperty]"
      )
      .forEach((field) => {
        field.addEventListener("change", () => {
          if (field.checked && field?.value === "Yes") {
            howManyLossesHaveOccurred.disabled = false;
            howManyLossesHaveOccurred?.classList.add("requiredxs");
          } else {
            howManyLossesHaveOccurred.disabled = true;
            howManyLossesHaveOccurred?.classList.remove("requiredxs");
            removeErrorOnDisabledSC(howManyLossesHaveOccurred);
          }
        });
      });
  }

  function floodOverviewValidationSC() {
    const isValidate = validateFormSC("property_overview_form");

    //
    const awareOfFloodLossesOnProperty = document.querySelector(
      ".field__input [data-sc-field-name=awareOfFloodLossesOnProperty]:checked"
    );
    if (!awareOfFloodLossesOnProperty) {
      const awareOfFloodError = document.querySelector(".awareOfFloodError");
      awareOfFloodError.style.display = "block";

      document
        .querySelectorAll(
          ".field__input [data-sc-field-name=awareOfFloodLossesOnProperty]"
        )
        .forEach((el) =>
          el.addEventListener(
            "change",
            () => (awareOfFloodError.style.display = "none")
          )
        );
    } else {
      formDataSC[awareOfFloodLossesOnProperty?.dataset.scFieldName] =
        awareOfFloodLossesOnProperty?.value;
    }

    return isValidate && Boolean(awareOfFloodLossesOnProperty);
  }

  // *********************************************
  // STEP-3 "Property Details" FUNCTIONALITY & VALIDATION
  // *********************************************
  function floodDetailsFuncSC() {
    const isStructureACondominium = document.querySelector(
      ".field__input [data-sc-field-name=isStructureACondominium]:checked"
    );

    const whatFloorIsYourCondominiumOn = document.getElementsByClassName(
      "whatFloorIsYourCondominiumOn"
    )[0];

    document
      .querySelectorAll(
        ".field__input [data-sc-field-name=isStructureACondominium]"
      )
      .forEach((field) => {
        field.addEventListener("change", () => {
          if (field.checked && field?.value === "Yes") {
            whatFloorIsYourCondominiumOn.disabled = false;
            whatFloorIsYourCondominiumOn?.classList.add("requiredxs");
          } else {
            whatFloorIsYourCondominiumOn.disabled = true;
            whatFloorIsYourCondominiumOn?.classList.remove("requiredxs");
            removeErrorOnDisabledSC(whatFloorIsYourCondominiumOn);
          }
        });
      });

    //
    const garageType = document.getElementsByClassName("garageType")[0];
    const garageValue = document.getElementsByClassName("garageValue")[0];

    garageType.addEventListener("change", (e) => {
      if (e.target.value === "Detached") {
        garageValue.disabled = false;
        garageValue?.classList.add("requiredxs");
      } else {
        garageValue.disabled = true;
        garageValue?.classList.remove("requiredxs");
        removeErrorOnDisabledSC(garageValue);
      }
    });
  }

  function floodDetailsValidationSC() {
    const isValidate = validateFormSC("property_details_form");

    //
    const isStructureACondominium = document.querySelector(
      ".field__input [data-sc-field-name=isStructureACondominium]:checked"
    );
    if (!isStructureACondominium) {
      const structureACondomError = document.querySelector(
        ".structureACondomError"
      );
      structureACondomError.style.display = "block";

      document
        .querySelectorAll(
          ".field__input [data-sc-field-name=isStructureACondominium]"
        )
        .forEach((el) =>
          el.addEventListener(
            "change",
            () => (structureACondomError.style.display = "none")
          )
        );
    } else {
      formDataSC[isStructureACondominium?.dataset.scFieldName] =
        isStructureACondominium?.value;
    }

    return isValidate && Boolean(isStructureACondominium);
  }
});

// Flood Form: Class added on the Button
document
  .querySelector(".flood_sitecore .button__back.button__left")
  ?.classList.add("floodBackBtnSC");
document
  .querySelector(".flood_sitecore .button__next.button__right")
  ?.classList.add("floodNextBtnSC");
