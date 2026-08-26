/**
slop - select options ---
*/

/**
 * Creates a filter dropdown button with custom options.
 * @param {Object} config
 * @param {string|Element} config.target - CSS selector or DOM element where the dropdown will be appended.
 * @param {Array<{label: string, value: string, dotColor?: string}>} config.options - List of options.
 * @param {string} [config.defaultValue] - Value to preselect (must match one of the options).
 * @param {string} [config.placeholder='All'] - Text shown when nothing is selected.
 * @param {function} [config.onSelect] - Callback fired on selection (receives {value, label}).
 * @param {string} [config.buttonWidth='110px'] - Min-width of the trigger button.
 * @param {string} [config.dropdownWidth='140px'] - Width of the dropdown menu.
 * @returns {Object} { trigger, dropdown, setValue, destroy } for programmatic control.
 */
function createFilterDropdown(config) {
  const {
    target,
    options = [],
    defaultValue = "",
    placeholder = "All",
    onSelect = null,
    buttonWidth = "110px",
    dropdownWidth = "140px",
  } = config;

  // Resolve target element
  const container =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!container) throw new Error("Target element not found");

  // Generate a unique ID for this instance
  const uid = "fd-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);

  // Find default label
  const defaultOption = options.find((opt) => opt.value === defaultValue);
  const defaultLabel = defaultOption ? defaultOption.label : placeholder;

  // Build the HTML
  const html = `
    <div class="relative flex-shrink-0" style="min-width:${buttonWidth}">
      <button id="trigger-${uid}"
        class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-between gap-2 hover:scale-105 border-blue-500/20"
        style="min-width:80px;border:none;letter-spacing:.5px;width:100%">
        <span id="selectedText-${uid}" style="font-size:11px;font-weight:700">${defaultLabel}</span>
        <i class="bi bi-chevron-down" style="font-size:.75rem;transition:transform .3s ease"></i>
      </button>
      <div id="dropdown-${uid}"
        class="rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex flex-col gap-2 hover:scale-105"
        style="background: #272726;margin-top:5px;position:fixed;right:0;width:${dropdownWidth};max-height:0;opacity:0;transition:all .3s cubic-bezier(.4,0,.2,1);transform:translateY(-10px);pointer-events:none;z-index:50">
        <div id="optionsContainer-${uid}"
          class="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 transition-all duration-300 flex flex-col gap-2"
          style="overflow:auto;max-height:105px;padding:6px 8px">
          ${options
            .map(
              (opt) => `
            <div class="dropdown-option px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 hover:scale-105"
              data-value="${opt.value}"
              style="${opt.value === defaultValue ? "border:1px solid rgba(59,130,246,0.2);background:rgba(59,130,246,0.1);" : "border:medium none currentcolor;"}"
            >
              ${opt.dotColor ? `<span class="status-dot" style="background:${opt.dotColor}"></span>` : ""}
              ${opt.label}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  // Insert into container
  container.insertAdjacentHTML("beforeend", html);

  // Get references
  const trigger = document.getElementById(`trigger-${uid}`);
  const dropdown = document.getElementById(`dropdown-${uid}`);
  const selectedText = document.getElementById(`selectedText-${uid}`);
  const optionsContainer = document.getElementById(`optionsContainer-${uid}`);
  const optionElements = optionsContainer.querySelectorAll(".dropdown-option");

  let isOpen = false;

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    dropdown.classList.toggle("open", isOpen);
    trigger.classList.toggle("active", isOpen);
  });

  // Handle option selection
  optionElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = el.dataset.value;
      const label = el.textContent.trim();

      // Update selected text
      selectedText.textContent = label;

      // Remove active styles from all options
      optionElements.forEach((opt) => {
        opt.classList.remove(
          "border-blue-500/20",
          "text-blue-600",
          "bg-blue-500/10",
        );
        opt.style.border = "medium none currentcolor";
        opt.style.background = "";
      });

      // Add active state to selected
      el.classList.add("border-blue-500/20", "text-blue-600", "bg-blue-500/10");
      el.style.border = "1px solid rgba(59,130,246,0.2)";
      el.style.background = "rgba(59,130,246,0.1)";

      // Close dropdown
      isOpen = false;
      dropdown.classList.remove("open");
      trigger.classList.remove("active");

      // Fire callback
      if (onSelect) onSelect({ value, label });

      // Dispatch custom event
      const event = new CustomEvent("filterChange", {
        detail: { value, label, instance: uid },
      });
      document.dispatchEvent(event);
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (isOpen && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
      isOpen = false;
      dropdown.classList.remove("open");
      trigger.classList.remove("active");
    }
  });

  // Prevent dropdown closing when clicking inside it
  dropdown.addEventListener("click", (e) => e.stopPropagation());

  // Public API
  return {
    trigger,
    dropdown,
    /**
     * Programmatically select an option by value.
     */
    setValue(value) {
      const opt = [...optionElements].find((el) => el.dataset.value === value);
      if (opt) opt.click();
    },
    /**
     * Destroy the instance and remove from DOM.
     */
    destroy() {
      const wrapper = trigger.closest(".relative.flex-shrink-0");
      if (wrapper) wrapper.remove();
    },
  };
}

// apending area
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = createFilterDropdown({
    target: "#filter-container",
    options: [
      { label: "Men", value: "Men" },
      { label: "women", value: "women" },
      { label: "kids", value: "kids" },
    ],
    defaultValue: "all", // pre‑select "All"
    placeholder: "Filter by status",
    onSelect: (selected) => {
      console.log("Selected:", selected);
      // Do something with the value, e.g., filter a list
    },
  });
});
