// /* =========================================================
//                                REUSABLE FILTER SYSTEM
//                                ========================================================= */

// function initFilters(root = document) {
//   const filters = root.querySelectorAll("[data-filter]");

//   if (!filters.length) return;

//   /* -----------------------------------------------------
//                                    Close one filter
//                                    ----------------------------------------------------- */

//   function closeFilter(filter) {
//     filter.classList.remove("is-open");

//     const trigger = filter.querySelector(".filter-trigger");

//     if (trigger) {
//       trigger.setAttribute("aria-expanded", "false");
//     }
//   }

//   /* -----------------------------------------------------
//                                    Close every other filter
//                                    ----------------------------------------------------- */

//   function closeOtherFilters(currentFilter) {
//     filters.forEach((filter) => {
//       if (filter !== currentFilter) {
//         closeFilter(filter);
//       }
//     });
//   }

//   /* -----------------------------------------------------
//                                    Toggle filter
//                                    ----------------------------------------------------- */

//   function toggleFilter(filter) {
//     const isOpen = filter.classList.contains("is-open");

//     if (isOpen) {
//       closeFilter(filter);

//       return;
//     }

//     closeOtherFilters(filter);

//     filter.classList.add("is-open");

//     const trigger = filter.querySelector(".filter-trigger");

//     if (trigger) {
//       trigger.setAttribute("aria-expanded", "true");
//     }
//   }

//   /* -----------------------------------------------------
//                                    Setup filters
//                                    ----------------------------------------------------- */

//   filters.forEach((filter) => {
//     const trigger = filter.querySelector(".filter-trigger");

//     const options = filter.querySelectorAll(".filter-option");

//     const valueElement = filter.querySelector(".filter-value");

//     if (!trigger) return;

//     /* ---------------------------------------------
//                                        Trigger click
//                                        --------------------------------------------- */

//     trigger.addEventListener("click", (event) => {
//       event.stopPropagation();

//       toggleFilter(filter);
//     });

//     /* ---------------------------------------------
//                                        Option click
//                                        --------------------------------------------- */

//     options.forEach((option) => {
//       option.addEventListener("click", (event) => {
//         event.stopPropagation();

//         const value = option.dataset.value ?? "";

//         const label = option.dataset.label ?? option.textContent.trim();

//         /* Update button text */

//         if (valueElement) {
//           valueElement.textContent = label;
//         }

//         /* Update selected option */

//         options.forEach((item) => {
//           item.classList.remove("is-selected");
//         });

//         option.classList.add("is-selected");

//         /* Close */

//         closeFilter(filter);

//         /* ---------------------------------
//                                                    Send custom event
//                                                    --------------------------------- */

//         filter.dispatchEvent(
//           new CustomEvent("filterChange", {
//             bubbles: true,

//             detail: {
//               filter: filter.dataset.filter,

//               value: value,

//               label: label,

//               element: filter,
//             },
//           }),
//         );
//       });
//     });
//   });

//   /* -----------------------------------------------------
//                                    Click outside
//                                    ----------------------------------------------------- */

//   document.addEventListener("click", (event) => {
//     filters.forEach((filter) => {
//       if (!filter.contains(event.target)) {
//         closeFilter(filter);
//       }
//     });
//   });

//   /* -----------------------------------------------------
//                                    Escape key
//                                    ----------------------------------------------------- */

//   document.addEventListener("keydown", (event) => {
//     if (event.key !== "Escape") return;

//     filters.forEach(closeFilter);
//   });
// }

// /* =========================================================
//                                INITIALIZE
//                                ========================================================= */

// document.addEventListener("DOMContentLoaded", () => {
//   initFilters();
// });

// /* =========================================================
//                                FILTER CHANGE EVENT
//                                ========================================================= */

// document.addEventListener("filterChange", (event) => {
//   const { filter, value, label } = event.detail;

//   console.log("Filter changed:", filter, value, label);

//   /* -----------------------------------------------
//                                        ORDER STATUS
//                                        ----------------------------------------------- */

//   if (filter === "order-status") {
//     console.log("Order status:", value);

//     /*
//                                             Example:

//                                             fetchOrdersByStatus(value);
//                                         */
//   }

//   /* -----------------------------------------------
//                                        PAYMENT
//                                        ----------------------------------------------- */

//   if (filter === "payment") {
//     console.log("Payment:", value);

//     /*
//                                             Example:

//                                             filterPayments(value);
//                                         */
//   }

//   /* -----------------------------------------------
//                                        DATE
//                                        ----------------------------------------------- */

//   if (filter === "date") {
//     console.log("Date:", value);

//     /*
//                                             Example:

//                                             filterOrdersByDate(value);
//                                         */
//   }
// });

// =========================================================
// REUSABLE FILTER SYSTEM - COMPLETE JS
// =========================================================

function initFilters(root = document) {
  const filters = root.querySelectorAll("[data-filter]");

  if (!filters.length) return;

  /* -----------------------------------------------------
       Close one filter
    ----------------------------------------------------- */

  function closeFilter(filter) {
    filter.classList.remove("is-open");

    const trigger = filter.querySelector(".filter-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  }

  /* -----------------------------------------------------
       Close every other filter
    ----------------------------------------------------- */

  function closeOtherFilters(currentFilter) {
    filters.forEach((filter) => {
      if (filter !== currentFilter) {
        closeFilter(filter);
      }
    });
  }

  /* -----------------------------------------------------
       Toggle filter
    ----------------------------------------------------- */

  function toggleFilter(filter) {
    const isOpen = filter.classList.contains("is-open");

    if (isOpen) {
      closeFilter(filter);
      return;
    }

    closeOtherFilters(filter);

    filter.classList.add("is-open");

    const trigger = filter.querySelector(".filter-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }
  }

  /* -----------------------------------------------------
       Update trigger text with selected value
    ----------------------------------------------------- */

  function updateTriggerText(filter, label) {
    const valueElement = filter.querySelector(".filter-value");
    const selectedElement = filter.querySelector(".filter-selected");

    if (selectedElement) {
      selectedElement.textContent = label;
    } else if (valueElement) {
      // If no .filter-selected, update the whole .filter-value
      const labelSpan = valueElement.querySelector(".filter-label");
      if (labelSpan) {
        // Keep label, update selected text
        const existingSelected = valueElement.querySelector(".filter-selected");
        if (existingSelected) {
          existingSelected.textContent = label;
        } else {
          // Create selected span if it doesn't exist
          const selectedSpan = document.createElement("span");
          selectedSpan.className = "filter-selected";
          selectedSpan.textContent = label;
          valueElement.appendChild(selectedSpan);
        }
      } else {
        valueElement.textContent = label;
      }
    }
  }

  /* -----------------------------------------------------
       Setup filters
    ----------------------------------------------------- */

  filters.forEach((filter) => {
    const trigger = filter.querySelector(".filter-trigger");
    const options = filter.querySelectorAll(".filter-option");
    const valueElement = filter.querySelector(".filter-value");

    if (!trigger) return;

    /* ---------------------------------------------
           Trigger click
        --------------------------------------------- */

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFilter(filter);
    });

    /* ---------------------------------------------
           Option click
        --------------------------------------------- */

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();

        const value = option.dataset.value ?? "";
        const label = option.dataset.label ?? option.textContent.trim();

        // Get the clean label (remove any nested elements)
        let cleanLabel = label;
        const textSpan = option.querySelector(
          "span:not(.color-swatch):not(.option-check)",
        );
        if (textSpan) {
          cleanLabel = textSpan.textContent.trim();
        }

        /* Update button text */
        updateTriggerText(filter, cleanLabel);

        /* Update selected option */
        options.forEach((item) => {
          item.classList.remove("is-selected");
        });
        option.classList.add("is-selected");

        /* Close */
        closeFilter(filter);

        /* ---------------------------------
                   Send custom event
                --------------------------------- */

        filter.dispatchEvent(
          new CustomEvent("filterChange", {
            bubbles: true,
            detail: {
              filter: filter.dataset.filter,
              value: value,
              label: cleanLabel,
              element: filter,
              option: option,
            },
          }),
        );
      });
    });

    /* ---------------------------------------------
           Set initial selected state
        --------------------------------------------- */

    const selectedOption = filter.querySelector(".filter-option.is-selected");
    if (selectedOption) {
      const label =
        selectedOption.dataset.label || selectedOption.textContent.trim();
      updateTriggerText(filter, label);
    }
  });

  /* -----------------------------------------------------
       Click outside
    ----------------------------------------------------- */

  document.addEventListener("click", (event) => {
    filters.forEach((filter) => {
      if (!filter.contains(event.target)) {
        closeFilter(filter);
      }
    });
  });

  /* -----------------------------------------------------
       Escape key
    ----------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    filters.forEach(closeFilter);
  });
}

/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
});

/* =========================================================
   FILTER CHANGE EVENT HANDLER
   ========================================================= */

document.addEventListener("filterChange", (event) => {
  const { filter, value, label, element } = event.detail;

  console.log(`Filter "${filter}" changed to:`, value, label);

  /* -----------------------------------------------
       COLOR FILTER
    ----------------------------------------------- */
  if (filter === "color") {
    const colorSwatches = document.querySelectorAll(".color-option");
    colorSwatches.forEach((swatch) => {
      const isSelected = swatch.dataset.value === value;
      swatch.classList.toggle("is-selected", isSelected);
    });

    // Update color count
    const colorCount = document.getElementById("colorCount");
    if (colorCount) {
      const total = document.querySelectorAll(".color-option").length;
      const selected = document.querySelector(".color-option.is-selected");
      colorCount.textContent = selected
        ? `${selected.dataset.value}`
        : `${total}-Colors`;
    }
  }

  /* -----------------------------------------------
       SIZE FILTER
    ----------------------------------------------- */
  if (filter === "size") {
    const sizeOptions = document.querySelectorAll(".size-option");
    sizeOptions.forEach((opt) => {
      opt.classList.toggle("is-selected", opt.dataset.value === value);
    });

    // Update size count display
    const sizeCount = document.querySelector(
      ".filter[data-filter='size'] .filter-dropdown-header span:last-child",
    );
    if (sizeCount) {
      const total = document.querySelectorAll(".size-option").length;
      sizeCount.textContent = `${total}-Sizes`;
    }
  }

  /* -----------------------------------------------
       ORDER STATUS
    ----------------------------------------------- */
  if (filter === "order-status") {
    console.log("Order status filtered:", value);
    // Example: filterOrdersByStatus(value);
  }

  /* -----------------------------------------------
       PAYMENT
    ----------------------------------------------- */
  if (filter === "payment") {
    console.log("Payment filtered:", value);
    // Example: filterPayments(value);
  }

  /* -----------------------------------------------
       DATE
    ----------------------------------------------- */
  if (filter === "date") {
    console.log("Date filtered:", value);
    // Example: filterOrdersByDate(value);
  }
});

/* =========================================================
   PROGRAMMATIC API
   ========================================================= */

// Set a filter value programmatically
function setFilterValue(filterSelector, value) {
  const filter = document.querySelector(filterSelector);
  if (!filter) return;

  const options = filter.querySelectorAll(".filter-option");
  let found = false;

  options.forEach((option) => {
    if (option.dataset.value === value) {
      option.click();
      found = true;
    }
  });

  if (!found) {
    console.warn(
      `Option with value "${value}" not found in filter "${filterSelector}"`,
    );
  }
}

// Reset a filter
function resetFilter(filterSelector) {
  const filter = document.querySelector(filterSelector);
  if (!filter) return;

  const options = filter.querySelectorAll(".filter-option");
  const firstOption = options[0];
  if (firstOption) {
    firstOption.click();
  }
}

// Reset all filters
function resetAllFilters() {
  const filters = document.querySelectorAll("[data-filter]");
  filters.forEach((filter) => {
    const options = filter.querySelectorAll(".filter-option");
    const firstOption = options[0];
    if (firstOption) {
      firstOption.click();
    }
  });
}

// Expose API globally
window.FilterSystem = {
  init: initFilters,
  setValue: setFilterValue,
  reset: resetFilter,
  resetAll: resetAllFilters,
};

console.log("✅ Filter System initialized");
