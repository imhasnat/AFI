var businessSuccessRedirectionSC = "/Quote-Forms-Save-Success";

let formDataSC = {
  StartDate: Date.now(),
  submitQuoteContactMethod: "Email",
  firstCommandAdvisorName: null,
  ResponseType: null,
  ResponseDescription: null,
  AdvisorName: null,
  OfferDescription: null,
  ZipCode: null,
  QuoteKey: "",
  MemberNumber: "",
  IsRecaptchaValid: false,
  IsStepOne: true,
};

let formListSC = ["radio_select"];
// *********************************************
//           SHOW FORM BY CONDITION
// *********************************************
function showActiveFormSC(step, backBtn) {
  // console.log({ step });
  // console.log(formDataSC);

  // remove active_section class from everywhere
  document.querySelector(".active_section")?.classList.remove("active_section");

  // set active_section class
  document
    .querySelector(`.${formListSC[step]}`)
    ?.classList.add("active_section");

  // Conditionally Hide Back Btn
  step <= 0
    ? backBtn?.classList.add("hide")
    : backBtn?.classList.remove("hide");
}

// *********************************************
//    VALIDATION & ERROR HANDLING LIBRARY
// *********************************************

// Error Message if value user makes any mistake
function eligibilityErrorMessageSC(data, selector) {
  const errorDiv = document.querySelector(selector);

  if (!data) {
    errorDiv?.classList.add("error");
  } else {
    errorDiv?.classList.remove("error");
  }
}

// Show error Message if value user makes any mistake
function inputErrorMessageSC(selector, msg) {
  const hasErrorField =
    selector?.parentElement?.querySelector(".field_message");

  if (!hasErrorField) {
    // create error message field
    const div = document.createElement("div");
    div.className = "field_message error";
    div.innerHTML = msg;
    const parentEl = selector?.parentElement;
    parentEl?.appendChild(div);

    // field__note
    const field__note = parentEl?.querySelector(".field__note");
    if (field__note) parentEl?.appendChild(field__note);
  } else {
    hasErrorField.innerHTML = msg;
    hasErrorField?.classList.add("error");
  }
}

// Check is input value is correct
function isValueEmptySC(selector) {
  const value = String(selector?.value).trim();

  if (!value) {
    inputErrorMessageSC(selector, "This field is required");
    return false;
  }

  const isValueStrNull = String(value).toLocaleLowerCase() == "null";

  if (isValueStrNull) {
    inputErrorMessageSC(selector, "Input valid value");
    return false;
  }

  return true;
}

// Input Number Only
document.querySelectorAll(".field__input.numberOnly")?.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target?.value.replace(/[^0-9]/g, "");
  });
});

// Input Alphabet Only
document
  .querySelectorAll(".field__input.alphabeticOnlySC")
  ?.forEach((input) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target?.value.replace(
        /[^a-zA-Z\s\-!#$%^&*()_+=[\]{}|;:'",.<>?`~]+/g,
        ""
      ); // /[^a-zA-z]/g
    });
  });

// Input Alphabet Only
document.querySelectorAll(".field__input.typeAlphabetic")?.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target?.value.replace(
      /[^a-zA-Z\s\-!#$%^&*()_+=[\]{}|;:'",.<>?`~]+/g,
      ""
    ); // /[^a-zA-z]/g
  });
});

// Alphabetic only
function alphabeticOnlySC(selector) {
  const letterRegEx = /[a-zA-Z\s\-!#$%^&*()_+=[\]{}|;:'",.<>?`~]+/g;
  // const letterRegEx = /^[A-Za-z]+$/;
  const isMatched = letterRegEx.test(selector?.value);

  if (isMatched) {
    return true;
  } else {
    inputErrorMessageSC(selector, "Please enter alphabetic characters only");
    return false;
  }
}

// Minimum value need
function minValueSC(selector, minValueSC = 5, msg) {
  if (selector?.value.length != minValueSC) {
    inputErrorMessageSC(selector, msg);
    return false;
  } else {
    return true;
  }
}

// Email validation
function emailValidationSC(selector) {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEx.test(selector?.value)) {
    return true;
  } else {
    inputErrorMessageSC(selector, "Please enter a valid email address");
    return false;
  }
}

// Phone Number validation
function phoneValidationSC(selector) {
  const regEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  if (regEx.test(selector?.value)) {
    if (String(selector?.value)[1] == 0 || String(selector?.value)[1] == 1) {
      inputErrorMessageSC(selector, "First digit cannot be 0 or 1.");
      return false;
    }

    return true;
  } else {
    inputErrorMessageSC(selector, "Please enter a valid phone number");
    return false;
  }
}

// Phone Number Pattern
function phoneNumberPatternSC(selector) {
  if (!selector) {
    selector = document.getElementsByClassName("policyHolderPhoneNumber")[0];
  }

  selector?.addEventListener("input", (e) => {
    const input = e.target;
    const previousSelectionStart = input.selectionStart;
    const previousSelectionEnd = input.selectionEnd;
    const previousLength = input.value.length;

    const value = input.value;

    // not allow type 0 as first digit
    if (value.length === 1 && value === "0") {
      input.value = input.value.replace("0", "");
    }

    // not allow type 0 as first digit
    if (value.length === 1 && value === "1") {
      input.value = input.value.replace("1", "");
    }

    var x = input.value.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    input.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");

    // Adjust the cursor position based on changes in length
    const newLength =
      input.value.length - previousLength + previousSelectionStart;
    const newPosition =
      newLength > 0 ? Math.min(newLength, input.value.length) : 0;
    input.setSelectionRange(newPosition, newPosition);
  });
}

// Social Security Number Pattern
document.querySelectorAll(".SSN").forEach((field) => {
  field.addEventListener("input", (e) => {
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
  });
});

// Dollar Field Pattern
function currencyFieldFuncSC() {
  const dollarField = document.querySelectorAll(".field__input.dollar");

  dollarField?.forEach((field) => {
    field?.addEventListener("input", (e) => {
      if (e.target.value) {
        let modifiedValue = e.target.value
          .toString()
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        e.target.value = `$${modifiedValue}`;
      }
    });
  });
}

// Date Validation
const thisYearSC = new Date().getFullYear();
function dateValidationSC(field, getMaxYear = thisYearSC) {
  field?.addEventListener("input", (e) => {
    let value = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,2})(\d{0,2})(\d{0,4})/);

    let [fullData, MM, DD, YYYY] = value;

    // Month Validation
    if (MM.length === 1 && Number(MM) > 1) value[1] = 0 + MM[0];
    else if (MM.length === 2 && Number(MM) <= 0) value[1] = MM[0];
    else if (MM.length === 2 && Number(MM) > 12) value[1] = MM[0];

    // Date Validation
    if (DD.length === 1 && Number(DD) > 3) value[2] = 0 + DD[0];
    else if (DD.length === 2 && Number(DD) <= 0) value[2] = DD[0];
    else if (DD.length === 2 && Number(DD) > 31) value[2] = DD[0];
    else if (DD.length === 2 && Number(MM) == 2 && Number(DD) > 29)
      value[2] = DD[0];
    else if ([4, 6, 9, 11].includes(Number(MM)) && Number(DD) > 30)
      value[2] = DD[0];

    // Year validation
    const maxYear = String(getMaxYear);
    // const maxYear = String(new Date().getFullYear() + 2);

    if (Number(YYYY) <= 0) value[3] = "";
    else if (YYYY.length === 1 && Number(YYYY) > 2) value[3] = "";
    else if (YYYY.length === 2 && Number(YYYY) > 20) value[3] = YYYY[0];
    else if (YYYY.length === 2 && Number(YYYY) < 19) value[3] = YYYY[0];
    else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
      value[3] = YYYY.slice(0, 2);
    else if (YYYY.length === 4 && Number(YYYY) > Number(maxYear))
      value[3] = YYYY.slice(0, 3);

    // Result
    e.target.value = !value[2]
      ? value[1]
      : value[1] + "/" + value[2] + (value[3] ? "/" + value[3] : "");
  });
}
document.querySelectorAll(".DOB").forEach((el) => dateValidationSC(el));
document.querySelectorAll(".date").forEach((el) => dateValidationSC(el));

function calculateAgeSC(date) {
  birthDate = new Date(date);
  otherDate = new Date();

  var years = otherDate.getFullYear() - birthDate.getFullYear();

  if (
    otherDate.getMonth() < birthDate.getMonth() ||
    (otherDate.getMonth() == birthDate.getMonth() &&
      otherDate.getDate() < birthDate.getDate())
  ) {
    years--;
  }

  return years;
}

// Input Year
document.querySelectorAll(".field__input.year")?.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target?.value.replace(/[^0-9]/g, "");
  });
});

const isAdultSC = (field) => {
  const result = calculateAgeSC(field?.value) >= 18;

  if (!result) {
    inputErrorMessageSC(
      field,
      "Primary policyholder must be 18 years or older to continue"
    );
    return false;
  } else {
    return true;
  }
};
// *********************************************
//            COMMON FUNCTIONALITIES
// *********************************************
// KeyPress only remove field Error Message
function removeErrorOnChangeSC() {
  document
    .querySelectorAll(".form_container .field")
    ?.forEach((fieldWrapper) => {
      const removeFieldError = () => {
        const errorField = fieldWrapper?.querySelector(".field_message");
        errorField?.classList.remove("error");
      };

      fieldWrapper
        ?.querySelectorAll(".field__input")
        .forEach((inputField) =>
          inputField?.addEventListener("input", removeFieldError)
        );
    });
}

// Press Enter Submit Form
function pressEnterToSubmitSC(nextBtn) {
  // if (!nextBtn) nextBtn = document.querySelector(".quote_request__action_buttons .button__next.button__right");

  document.querySelectorAll(".field__input")?.forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (event?.key === "Enter") {
        event.preventDefault();

        // Trigger the button element with a click
        nextBtn?.click();
      }
    });
  });
}

// common function to remove error message
function removeErrorOnDisabledSC(field) {
  // clean value
  // field.value = "";

  // remove errors
  const errorMessage = field?.closest(".field")?.querySelector(".error");
  if (errorMessage) errorMessage.remove();
}

// Function for Clean data and property from formDataSC if it disabled
function cleanValueIfDisabledSC(field) {
  if (field.disabled) {
    if (formDataSC[field.name]) delete formDataSC[field.name];
  }

  return field.disabled; // is field disabled
}

function ActiveFormcleanValueIfDisabledSC(activeForm) {
  const avoidForms = ["property_quoted_form", "add_vehicle_form"];
  const hasAvoidForm = avoidForms.includes(activeForm);
  if (hasAvoidForm) return;

  const disabledFields = document.querySelectorAll(
    ".active_section .field__input:disabled"
  );
  disabledFields?.forEach((field) => cleanValueIfDisabledSC(field));
}

// *********************************************
//             Eligibility Validation
// *********************************************
function eligibilityValidationSC(forms = []) {
  const eligibilityStatus = document.querySelector(
    'input[data-sc-field-name="eligibilityStatus"]:checked'
  )?.value;

  // Select formListSC as user eligibilityStatus
  if (Boolean(eligibilityStatus)) {
    if (eligibilityStatus === "military") {
      formListSC = ["radio_select", "military_information", ...forms];
    } else if (eligibilityStatus === "child") {
      formListSC = ["radio_select", "parent_information", ...forms];
    } else if (eligibilityStatus === "parent") {
      formListSC = ["radio_select", "child_information", ...forms];
    } else {
      formListSC = ["radio_select", ...forms];
    }
    // maxStep = formListSC?.length - 1;

    // set eligibilityStatus to formDataSC
    formDataSC.eligibilityStatus = eligibilityStatus;
  }

  // Error Message if value = null
  eligibilityErrorMessageSC(
    formDataSC.eligibilityStatus,
    ".radio__form_section .field_message"
  );
  return eligibilityStatus;
}

// *********************************************
//              FORM VALIDATION
// *********************************************
function validateFormSC(formClassName, dataAssign = true) {
  const allFields = document.querySelectorAll(
    `.${formClassName} .field__input`
  );

  const yearValidator = (field) =>
    minValueSC(field, 4, "Please enter a valid year");

  const dateValidator = (field) =>
    minValueSC(field, 10, "Please enter a valid date");

  const zipValidator = (field) =>
    minValueSC(field, 5, "Please enter a valid Zip code");

  const classAndValidator = [
    { class: "checkAdult", validator: isAdultSC },
    { class: "year", validator: yearValidator },
    { class: "date", validator: dateValidator },
    { class: "zip", validator: zipValidator },
    { class: "email", validator: emailValidationSC },
    { class: "phone", validator: phoneValidationSC },
    { class: "alphabeticOnlySC", validator: alphabeticOnlySC },
    { class: "requiredxs", validator: isValueEmptySC },
  ];

  const checkValidation = [];

  allFields.forEach((field) => {
    // clear formDataSC and validation if field is disabled
    cleanValueIfDisabledSC(field);

    // validate field by containing class
    classAndValidator.forEach((checker) => {
      if (field.classList.contains(checker.class)) {
        checkValidation.push(checker.validator(field));
      }
    });

    // check value null String or not
    const value = field?.value;
    const isValueStrNull = String(value).toLocaleLowerCase() == "null";

    if (isValueStrNull) {
      inputErrorMessageSC(field, "Input valid value");
      checkValidation.push(false);
    }
  });

  const isValidate = checkValidation.every((result) => result === true);

  if (isValidate && dataAssign) {
    allFields.forEach((field) => {
      formDataSC[field?.dataset.scFieldName] = field.value;
    });
  }

  return isValidate;
}

// MILITARY INFO FROM VALIDATION
function militaryValidationSC() {
  const isValidate = validateFormSC("military_information");

  // Set Name in Multi-step form field
  const fnameValue = document.querySelector(".eligibilityFirstName")?.dataset
    .scFieldName;
  const lnameValue = document.querySelector(".eligibilityLastName")?.dataset
    .scFieldName;

  const getFirstName = formDataSC[fnameValue] ? formDataSC[fnameValue] : "";
  const getLastName = formDataSC[lnameValue] ? formDataSC[lnameValue] : "";

  document.querySelector(".policyHolderFirstName").value = getFirstName;
  document.querySelector(".policyHolderLastName").value = getLastName;
  return isValidate;
}

// POLICY HOLDER FORM VALIDATION
function policyholderValidationSC(step, hasCohabitant = true) {
  const isValidate = validateFormSC("policyholder_form");

  if (isValidate) {
    // SHOW SPOUSE INFORMATION FORM, IF HAVE
    let spouseValues = [
      "Married",
      "Cohabitant",
      "Civil Union Or Domestic Partner",
    ];
    if (!hasCohabitant)
      spouseValues = ["Married", "Civil Union Or Domestic Partner"];

    if (spouseValues.includes(formDataSC.policyHolderMaritalStatus)) {
      if (!formListSC?.includes("spouse_information")) {
        formListSC?.splice(step + 1, 0, "spouse_information");
      }
    }

    if (!spouseValues.includes(formDataSC.policyHolderMaritalStatus)) {
      formListSC = formListSC?.filter((form) => form != "spouse_information");

      const spouseField = document.querySelectorAll(
        ".spouse_information .field__input"
      );

      spouseField.forEach((field) => {
        delete formDataSC[field.name];
      });
    }
  }

  return isValidate;
}

/********************************************************
 *                   Military SECTION FUNC
 ********************************************************/
function militaryFormFuncSC() {
  // Military Rank should be disabled if branchOfService value none
  const branchOfService = document.getElementsByClassName("branchOfService")[0];

  if (branchOfService) {
    branchOfService.addEventListener("change", () => {
      const militaryRank = document.getElementsByClassName("militaryRank")[0];

      if (Boolean(branchOfService?.value)) {
        militaryRank.disabled = false;
        militaryRank.classList.add("requiredxs");
      } else {
        militaryRank.disabled = true;
        militaryRank.classList.remove("requiredxs");
        removeErrorOnDisabledSC(militaryRank);
      }

      // ******************* GET OPTIONS DYNAMICALLY *******************
      awaitedFieldSC(militaryRank, true);

      var selectedtext = $(".branchOfService option:selected").text();

      $.ajax({
        type: "GET",
        url: "/api/sitecore/QuoteForm/GetMilitaryRanks?type=" + selectedtext,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: "{}",
        success: function (data) {
          let dropdown = $(".militaryRank");
          dropdown.empty();

          $(".militaryRank").append('<option value="">Select Rank</option>');
          var jsonArray = JSON.parse(data);
          var option;
          for (var i = 0; i < jsonArray.length; i++) {
            option = document.createElement("option");
            option.text = jsonArray[i]["label"];
            option.value = jsonArray[i]["value"];
            militaryRank.add(option);
          }

          awaitedFieldSC(militaryRank, false);
        },
      });
    });
  }
}

function awaitedFieldSC(el, disability) {
  if (disability) {
    el.value = "wait";
    el.disabled = true;
  } else {
    el.value = "";
    el.disabled = false;
  }
}

// *********************************************
//      Household Violations FUNCTIONALITY
// *********************************************
const addViolationBtnSC = document.getElementById("add_violation_btn");
const violationsFieldsSC = document.querySelector(".violation_info_fields");
const violationWrapperSC = document.getElementById(
  "violation_info_fields_wrapper"
);

let vioSerialSC = 0;

// ******************* Violation Form Functionality *******************
// ADD MORE VIOLATIONS FIELDS
addViolationBtnSC?.addEventListener("click", function () {
  vioSerialSC++;

  const newFields = violationsFieldsSC.cloneNode(true);
  newFields.querySelectorAll(".field__input").forEach((field) => {
    field.value = "";

    const newId = field.id.replace("0", vioSerialSC);
    field.id = field.name = newId;

    // Driver name alphabetical only
    if (field.classList.contains("alphabeticOnlySC")) {
      field.addEventListener("input", (e) => {
        e.target.value = e.target?.value.replace(
          /[^a-zA-Z\s\-!#$%^&*()_+=[\]{}|;:'",.<>?`~]+/g,
          ""
        ); // /[^a-zA-z]/g
      });
    }
  });

  // for new fields : clearFieldErrorMsg
  newFields.querySelectorAll(".error").forEach((errField) => errField.remove());

  violationWrapperSC?.appendChild(newFields);

  // Data Validator added
  document
    .querySelectorAll(".householdViolationsDate")
    .forEach((vDate) => dateValidationSC(vDate, thisYearSC));

  if (violationWrapperSC?.children.length >= 5) {
    this.disabled = true;
  }

  removeErrorOnChangeSC();
});

// IF householdViolationsPreviousClaims value not== Yes, then disable all
function disableViolationInputsSC(disable = true) {
  const violationInputs = violationWrapperSC?.querySelectorAll(".field__input");

  violationInputs?.forEach((input) => (input.disabled = disable));
  addViolationBtnSC.disabled = disable;
}

if (addViolationBtnSC && violationWrapperSC) disableViolationInputsSC(true);

const hasviolationsFieldsSC = document.getElementsByName(
  "householdViolationsPreviousClaims"
);
const getViolationsValueSC = () => {
  let value = "";
  hasviolationsFieldsSC?.forEach((field) => {
    if (field?.checked) value = field.value;
  });

  return value;
};

// Get every violation Radio field's value
hasviolationsFieldsSC.forEach((fields) => {
  fields?.addEventListener("change", () => {
    let getValue = getViolationsValueSC();

    if (getValue === "Yes") {
      disableViolationInputsSC(false);
    } else {
      disableViolationInputsSC(true);
    }

    let fieldContainer = document.querySelector(".violations__form");
    if (!fieldContainer)
      fieldContainer = document.querySelector(".violations_form");
    if (!fieldContainer)
      fieldContainer = document.querySelector(".active_section");

    if (fieldContainer) {
      const errors = fieldContainer.querySelectorAll(".field_message.error");
      errors.forEach((error) => error.remove());
    }
  });
});

// ******************* Watercraft and Motorcycle *******************

function violationDriverFuncSC() {
  const vioDriver = document.querySelectorAll(
    ".select.householdViolationsDriver"
  );
  if (!vioDriver) return;

  function driverOptionAdd(element, value, name) {
    element.insertAdjacentHTML(
      "beforeend",
      `<option value="${value}">${name}</option>`
    );
  }

  // reset options
  vioDriver?.forEach((driverEl) => {
    driverEl.innerHTML = "";
    driverOptionAdd(driverEl, "", "Choose One");

    // policyHolder
    if (formDataSC.policyHolderFirstName)
      driverOptionAdd(
        driverEl,
        "policyHolder",
        `${formDataSC?.policyHolderFirstName} ${formDataSC?.policyHolderLastName}`
      );
    // cohabitant
    if (formDataSC.cohabitantFirstName)
      driverOptionAdd(
        driverEl,
        "cohabitant",
        `${formDataSC?.cohabitantFirstName} ${formDataSC?.cohabitantLastName}`
      );

    // driver 0
    if (formDataSC.additionalDriver0FirstName)
      driverOptionAdd(
        driverEl,
        "additionalDriver0",
        `${formDataSC?.additionalDriver0FirstName} ${formDataSC?.additionalDriver0LastName}`
      );
    // driver 1
    if (formDataSC.additionalDriver1FirstName)
      driverOptionAdd(
        driverEl,
        "additionalDriver1",
        `${formDataSC?.additionalDriver1FirstName} ${formDataSC?.additionalDriver1LastName}`
      );
    // driver 2
    if (formDataSC.additionalDriver2FirstName)
      driverOptionAdd(
        driverEl,
        "additionalDriver2",
        `${formDataSC?.additionalDriver2FirstName} ${formDataSC?.additionalDriver2LastName}`
      );
  });
}

// *********************************************
//               ACCORDION FUNCTIONALITIES
// *********************************************
function accordionFuncSC() {
  // **** coverageLimitsValidation 'qrf-accordion' Functionality ****
  const accordionButtons = document.querySelectorAll(".qrf-accordion__trigger");
  if (!accordionButtons) return; // safe return to prevent errors

  accordionButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      const accordion = button.closest(".qrf-accordion");
      accordion.classList.toggle("qrf-accordion--active");

      const symbol = button.querySelector(".qrf_accordion");
      if (accordion.classList.contains("qrf-accordion--active"))
        symbol.innerHTML = "-";
      else symbol.innerHTML = "+";
    });
  });
}

// *********************************************
//        PROPERTY CLAIMS FUNCTIONALITY
// *********************************************

function propertyClamsFuncSC() {
  const propertyClaimsCount = document.getElementById("propertyClaimsCount");
  const propertyClaimsDetails = document.getElementById(
    "propertyClaimsDetails"
  );
  if (!propertyClaimsCount || !propertyClaimsDetails) return;

  // if (propertyClaimsCount.value == "" || propertyClaimsCount.value == "0") {
  //   propertyClaimsDetails.classList.remove("required");
  //   propertyClaimsDetails.disabled = true;

  //   removeErrorOnDisabledSC(propertyClaimsDetails);
  // }

  propertyClaimsCount.addEventListener("change", (e) => {
    if (e.target.value == "" || e.target.value == "0") {
      propertyClaimsDetails.classList.remove("requiredxs");
      propertyClaimsDetails.disabled = true;
      removeErrorOnDisabledSC(propertyClaimsDetails);
    } else {
      propertyClaimsDetails.classList.add("requiredxs");
      propertyClaimsDetails.disabled = false;
    }
  });
}

// ******************* Vehicle Built Year Functionality *******************
function builtYearFunctionalitySC() {
  var currentYear = new Date().getFullYear();

  // Generate options for the dropdowns
  var dropdown = $("#propertyYearBuilt");
  var dropdown_1 = $("select#vehicle0Year");
  var vehiclePurchased = $("select#vehicle0YearPurchased");

  var optionBefore1900 = $("<option></option>")
    .attr("value", "before1900")
    .text("Before 1900");

  for (var year = currentYear; year >= 1900; year--) {
    var option = $("<option></option>").attr("value", year).text(year);

    // Clone the option element for each dropdown
    dropdown.append(option.clone());
    dropdown_1.append(option.clone());
    vehiclePurchased.append(option.clone());
  }

  // Append the optionAfter1800 to each dropdown separately
  dropdown.append(optionBefore1900.clone());
  dropdown_1.append(optionBefore1900.clone());
  vehiclePurchased.append(optionBefore1900.clone());
}

window.addEventListener("load", (e) => {
  propertyClamsFuncSC();
  removeErrorOnChangeSC();
  violationDriverFuncSC();
  accordionFuncSC();
  createErrorResponseElementSC();
  currencyFieldFuncSC();
  phoneNumberPatternSC();
  builtYearFunctionalitySC();
});

// *********************************************
//            COMMON STEP 4 FUNCTIONALITIES
// *********************************************
function coverageHistoryFuncSC() {
  // if currentInsuranceCompany = "Other" then Insurance Company field will show
  const insuranceCompany = document.querySelector(".currentInsuranceCompany");
  const policyRenewalDate = document.querySelector(".policyRenewalDate");

  insuranceCompany?.addEventListener("change", (e) => {
    const insComWrapper = document.querySelector(".insuranceCompany");
    const companyName = insComWrapper.querySelector(".field__input");

    // show insuranceCompany field if select other
    if (e.target.value === "Other") {
      insComWrapper?.classList.remove("conditionally_hidden_field", "__hide");
      companyName?.classList.add("requiredxs");
    } else {
      insComWrapper?.classList.add("__hide");
      companyName?.classList.remove("requiredxs");
      removeErrorOnDisabledSC(companyName);
    }

    // disable Renewal Date field, if select other none
    const policyRenewalDate =
      document.getElementsByClassName("policyRenewalDate")[0];
    if (policyRenewalDate)
      policyRenewalDate.disabled = e.target.value === "None";
    if (policyRenewalDate.disabled) {
      policyRenewalDate.classList.remove("date");
      removeErrorOnDisabledSC(policyRenewalDate);
    }
  });

  // STEP 4 - Policy Renewal Data Validation

  if (policyRenewalDate) {
    dateValidationSC(policyRenewalDate, thisYearSC + 2);

    // if field value has then validate
    policyRenewalDate.addEventListener("input", (e) => {
      const value = e.target.value;

      if (value) {
        policyRenewalDate.classList.add("date");
      } else {
        policyRenewalDate.classList.remove("date");
      }
    });
  }
}

/********************************************************
 *                   VEHICLE COMMON FUNCTIONS
 ********************************************************/
function updateArrToformDataSC(vehiclesArr = []) {
  vehiclesArr.forEach((info) => (formDataSC = { ...formDataSC, ...info }));
  if (formDataSC?.vehicleId) delete formDataSC.vehicleId;
  if (formDataSC?.driverId) delete formDataSC.vehicleId;
}
/********************************************************
 *                   API CALL
 ********************************************************/
// SAVE FORM DATA
async function saveDataSC(
  url,
  data = formDataSC,
  nextBtn,
  cForm,
  action,
  addressValidType
) {
  // clean the payload by removing disabled fields data
  ActiveFormcleanValueIfDisabledSC(cForm);

  // ********** store all field's id and disabled state **********
  const fieldStates = [];

  if (cForm) {
    const formFields = document.querySelectorAll(`.${cForm} .field__input`);
    // Process Start
    formFields.forEach((field) => {
      const fieldState = { id: field.id, disabled: field.disabled };
      fieldStates.push(fieldState);

      field.disabled = true;
    });
  }
  // ********** Turn off form functionality until response is received **********
  nextBtn.disabled = true;
  nextBtn.innerText = "Saving...";
  document.querySelector(".button__back").disabled = true;

  // ********** Remove $ Sign form Data **********

  const values = formDataSC; // const values = data;
  let payload = {};

  for (const k in values) {
    if (String(values[k]).startsWith("$"))
      payload[k] = values[k].replace(/\D/g, "");
    else payload[k] = values[k];
  }

  // ********** set query data to payload **********
  if (!payload.ResponseDescription || !payload.ResponseType) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    payload = { ...payload, ...queryParams };
  }

  // ******************** API Call ********************
  const req_data = {
    action: action,
    recaptchaToken: "6LfR7R4gAAAAAJhdtt4xLoULHMVubpGhEYCN6SYR",
    values: payload,
  };

  let jsonData = null;

  try {
    // ********** address validation **********
    // ********** address validation **********
    const addressValUrl = "/sc-api/forms/getproductavailability";

    const ADDRESS_ERROR_MSG = `We're Sorry...<br/>
    We are unable to offer a quotation for the location provided. If you have any questions regarding our coverage locations, please call us at 800-495-8234.`;

    // const ZIP_VALUE = req_data.values?.policyHolderZip || req_data.values?.zip;
    const activeFormZipField = document.querySelector(
      ".active_section .field__input.zip"
    );

    if (addressValidType && activeFormZipField?.value) {
      const resAddress = await fetch(addressValUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          type: addressValidType,
          zipCode: activeFormZipField.value,
        }), // data
      });

      // res handle
      if (!resAddress.ok || resAddress.status == 500)
        throw new Error(ADDRESS_ERROR_MSG);

      const result = await resAddress.json();
      if (result?.ExceptionMessage)
        throw new Error(result.Message ?? ADDRESS_ERROR_MSG);
      if (!result?.available) throw new Error(ADDRESS_ERROR_MSG);
    }

    // *************** Save Data ***************
    // *************** Save Data ***************
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(req_data), // data
    });

    if (!res.ok)
      throw new Error(
        "Something went wrong. Please try again with valid data."
      );

    // ********** check data saved or not **********
    const resData = await res.json();

    // QuoteId & QuoteId add after first step
    if (resData.QuoteId && resData.QuoteId) {
      formDataSC.QuoteId = resData.QuoteId;
      formDataSC.QuoteKey = resData.QuoteKey;

      jsonData = resData;
    } else {
      throw new Error(
        "Something went wrong. Please try again with valid data."
      );
    }

    // MemberNumber add after first step
    if (resData?.MemberNumber) {
      formDataSC.MemberNumber = resData.MemberNumber;
    }

    // IsStepOne = false after first step
    if (!formDataSC.IsRecaptchaValid) formDataSC.IsRecaptchaValid = true;

    // IsStepOne = false after first step
    if (formDataSC?.IsStepOne) formDataSC.IsStepOne = false;
  } catch (error) {
    // RESPONSE ERROR MESSAGE
    showResponseErrorMessageSC(error?.message);
    console.log(error);
  } finally {
    // ********** After Process Done restored all fields **********
    // restore fields disability
    fieldStates.forEach((f) => {
      document.querySelector(`.${cForm} #${f.id}`).disabled = f.disabled;
    });

    nextBtn.disabled = false;
    nextBtn.innerText = "Next";
    document.querySelector(".button__back").disabled = false;

    // clear all fields if submit success
    if (action === "submit" && jsonData?.QuoteId) {
      const allFields = document.querySelectorAll(".field__input");

      allFields.forEach((field) => {
        if (field.type !== "radio" && field.type !== "checkbox") {
          field.value = "";
        }
      });
    }

    // return response data
    return jsonData;
  }
}

// SHOW ERROR MESSAGE IF ANY ERROR IS OCCUR
function showResponseErrorMessageSC(
  errMsg = "An error occurred. Please try again."
) {
  let errorResponse = document.getElementById("error-response");

  if (!errorResponse) {
    errorResponse = document.createElement("p");
    errorResponse.id = "error-response";

    document.body.appendChild(errorResponse);
  }

  // add it to the top of the body
  // if (errorResponse) document.body.insertAdjacentElement("afterbegin", errorResponse);

  errorResponse.innerHTML = errMsg;
  errorResponse.classList.add("show-error");

  const SHOW_ERROR_TIMEOUT = 10 * 1000;

  setTimeout(
    () => errorResponse.classList.remove("show-error"),
    SHOW_ERROR_TIMEOUT
  );
  // <p id="error-response" class="error-response">Something is wrong.</p> // HTML
}

function createErrorResponseElementSC() {
  let errorResponse = document.getElementById("error-response");
  if (!errorResponse) {
    errorResponse = document.createElement("p");
    errorResponse.id = "error-response";
  }

  document.body.appendChild(errorResponse);
}

/********************************************************
 *                   ASIDE FUNCTIONALITY
 ********************************************************/
const showAsideBtnSC = document.querySelectorAll(
  ".quote-request-sidebar__show-trigger"
);
// const showAsideBtnSC = document.querySelectorAll(".quote-request-sidebar__hide-trigger");

showAsideBtnSC.forEach((btn) => {
  btn.addEventListener("click", () => {
    const asideTag = btn
      .closest(".container")
      .querySelector(".quote_request_aside");
    if (asideTag) asideTag.classList.add("is-open");

    // Close Btn
    const hideAsideBtn = asideTag.querySelector(
      ".quote-request-sidebar__hide-trigger"
    );
    hideAsideBtn.addEventListener("click", () =>
      asideTag.classList.remove("is-open")
    );
  });
});

/********************************************************
 *                  FOR SITECORE FORMS
 ********************************************************/
window.addEventListener("load", () => {
  // /lead-gen
  const leadGenPhone = document.querySelector(".sitecore-form-red .maskphone");
  if (leadGenPhone) {
    leadGenPhone.maxLength = 14;
    phoneNumberPatternSC(leadGenPhone);
  }

  // TRIGGER reCaptcha TO GET TOKEN
  const form = document.querySelector(".js-recaptcha-form");

  if (form) {
    const formWithRecaptcha = recaptchaFormSC(form);
    formWithRecaptcha.executeRecaptcha();
  }
});

// ******************* Token : recaptchaFormSC *******************
const recaptchaFormSC = function (form) {
  // Declare variables
  let siteKey, action;

  // Function to initialize reCaptcha
  const initializeRecaptcha = function () {
    return window.grecaptcha.ready(function () {
      executeRecaptcha();
    });
  };

  // Function to execute reCaptcha
  const executeRecaptcha = function () {
    return window.grecaptcha
      .execute(siteKey, {
        action: action,
      })
      .then(function (token) {
        handleToken(token);
      });
  };

  // Function to handle the reCaptcha token
  const handleToken = function (token) {
    if (token) {
      // Find or create an input field for the token in the form
      var tokenInput = form.querySelector('[name="token"]');
      if (tokenInput) {
        tokenInput.value = token;
      } else {
        form.insertAdjacentHTML(
          "beforeend",
          '\n\t\t\t\t\t<input type="hidden" class="form__token" name="token" value="' +
            token +
            '" />\n\t\t\t\t'
        );
      }
    }
  };

  // Check if form exists and has necessary data attributes (sitekey and action)
  if (form) {
    siteKey = form.dataset.sitekey;
    action = form.dataset.action;

    // If both sitekey and action are available, initialize reCaptcha
    if (siteKey && action) {
      initializeRecaptcha(siteKey, action);
    }
  }

  // Return an object with a method to execute reCaptcha
  return {
    executeRecaptcha: executeRecaptcha,
  };
};

// Submit button functionality
function btnSubmittingSC(isSubmitting) {
  const submitBtn = document.querySelector(".js-submit-button");
  if (!submitBtn) return false; // safe return if submitBtn not found

  if (isSubmitting === true) {
    submitBtn.innerText = "Submitting";
    submitBtn.disabled = true;
  } else {
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  }
}

// Eligibility For Insurance: Checked filed highlighter & Remove the error msg
document
  .querySelectorAll(".radio__form_section .fIeld__radio")
  .forEach((field) => {
    field.addEventListener("click", () => {
      const haveCheckClass = document.querySelector(
        ".radio__form_section .fIeld__radio.checked"
      );

      const haveError = document.querySelector(
        ".radio_select .field_message.error"
      );

      const isChecked = field.querySelector(
        'input[data-sc-field-name="eligibilityStatus"]:checked'
      )?.checked;

      if (isChecked) {
        haveCheckClass?.classList.remove("checked");
        field?.classList.add("checked");

        haveError?.classList.remove("error");
      }
    });
  });

// Custom Button added on the SITECORE FROM
const btnBack = document.createElement("button");
btnBack.type = "button";
btnBack.className = "button button__back button__left hide";
btnBack.textContent = "Back";

const btnNext = document.createElement("button");
btnNext.type = "button";
btnNext.className = "button button__next button__right";
btnNext.textContent = "Next";

const quoteReqBtn = document.querySelector(
  ".quote_request__action_buttons.business_sitecore .container"
);

quoteReqBtn?.appendChild(btnBack);
quoteReqBtn?.appendChild(btnNext);
