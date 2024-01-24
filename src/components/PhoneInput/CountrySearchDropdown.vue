<template>
  <div
    class="phone-input-country"
    :class="{
      focus: focus,
      'phone-input-country-grouped': grouped,
    }"
    v-click-outside="onClose"
    @keydown="keyboardNav"
    tabindex="0"
  >
    <div
      @click="onSelectingClick"
      class="phone-input-country__selection"
      :class="{ hide: isShowDropdown }"
    >
      <div
        class="selection__flag iti-flag"
        :class="{ [selectedValue.toLocaleLowerCase()]: true }"
      ></div>
      <span v-if="grouped" class="country-name">{{ selectedName }}</span>
      <span class="country-prefix">{{ selectedPrefix }}</span>
    </div>
    <input
      :class="{ show: isShowDropdown }"
      class="search-code-phone-input"
      v-model="searchQuery"
      @input="filterCountries"
      ref="searchInput"
    />
    <ul class="phone-input-country__dropdown" v-if="isShowDropdown">
      <li
        class="dropdown__item"
        :ref="`option_item_${index}`"
        :class="{
          'keyboard-selected': tmpValue === country.iso2,
          selected: selectedValue === country.iso2,
        }"
        v-for="(country, index) in filteredCountries"
        :key="country.iso2"
        @click="onSelectCountry(country.iso2)"
      >
        <div
          class="dropdown__flag iti-flag"
          :class="{ [country.iso2.toLocaleLowerCase()]: true }"
        ></div>
        <div class="dropdown-country">
          <span class="dropdown-country-name">{{ country.name }}</span>
          <span class="dropdown-country-code">{{
            `+${country.dialCode}`
          }}</span>
        </div>
      </li>
      <div class="dropdown__item dropdown__item-nodata">No results found</div>
    </ul>
  </div>
</template>

<script>
import "./assets/flags.css";
import ClickOutside from "vue-click-outside";
import { countries } from "../../assets/js/config/phoneCodeCountries";
import { getCountryPhone } from "../../assets/js/helpers/phone";

export default {
  name: "CountrySearchDropdown",
  props: [
    "code",
    "prefix",
    "containerClassName",
    "focus",
    "error",
    "disabled",
    "grouped",
  ],
  data() {
    const { code = "th", prefix, name = "Thailand (ไทย)" } = this;
    return {
      isShowDropdown: false,
      countries: countries,
      tmpValue: 0,
      selectedValue: code,
      selectedName: name,
      query: "",
      selectedPrefix: prefix,
      suggestCountries: ["TH", "CN", "GB", "HK", "DE", "SG", "MY", "AU", "IN"],
      searchQuery: "",
      filteredCountries: this.countriesOptions,
    };
  },
  watch: {
    selectedValue(after, before) {
      if (after !== before) {
        this.updatePropsValue(after);
      }
    },
    code(after, before) {
      if (after !== before) {
        this.selectedValue = !after || after === null ? "us" : after;
      }
    },
  },
  computed: {
    tmpValueIndex() {
      return this.countriesOptions.findIndex((c) => c.iso2 === this.tmpValue);
    },
    suggestOptions() {
      const { countries = [], suggestCountries = [] } = this;
      return suggestCountries.map((code) => {
        return countries.find((item) => item.iso2 === code);
      });
    },
    remainingOptions() {
      const { countries = [], suggestCountries = [] } = this;
      return countries.reduce((result, item) => {
        if (!suggestCountries.includes(item.iso2)) {
          return [...result, item];
        } else {
          return result;
        }
      }, []);
    },
    countriesOptions() {
      const { suggestOptions = [], remainingOptions = [] } = this;
      return [...suggestOptions, ...remainingOptions];
    },
  },
  mounted() {
    this.filteredCountries = this.countriesOptions;
  },
  methods: {
    filterCountries() {
      const query = this.searchQuery.toLowerCase();
      this.filteredCountries = this.countriesOptions.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.iso2.toLowerCase().includes(query)
      );
    },
    updatePropsValue(value) {
      const countryData = this.getCountrySelected(value);
      const { dialCode, name } = countryData;
      const newPrefix = `+${dialCode}`;
      if (this.prefix !== newPrefix) {
        this.selectedPrefix = newPrefix;
        this.selectedName = name;
        this.$emit("update:prefix", newPrefix);
      }
    },
    getCountrySelected(selectedValue) {
      return getCountryPhone(selectedValue);
    },
    onSelectingClick() {
      this.searchQuery = "";
      this.filteredCountries = this.countriesOptions;
      const { isShowDropdown, disabled } = this;
      this.isShowDropdown = disabled ? false : !isShowDropdown;
      this.$refs.searchInput.focus();
    },
    onSelectCountry(code) {
      this.selectedValue = code;
      this.isShowDropdown = false;
    },
    onClose() {
      this.isShowDropdown = false;
    },
    scrollToSelectedOnFocus(arrayIndex) {
      this.$nextTick(() => {
        const element = this.$refs[`option_item_${arrayIndex}`];
        if (element && element[0]) {
          element[0].scrollIntoView({ block: "nearest" });
        }
      });
    },
    keyboardNav(e) {
      const code = e.keyCode;
      if (code === 40 || code === 38) {
        if (e.view && e.view.event) {
          e.view.event.preventDefault();
        }
        let index =
          code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1;
        if (index === -1 || index >= this.countriesOptions.length) {
          index = index === -1 ? this.countriesOptions.length - 1 : 0;
        }
        this.tmpValue = this.countriesOptions[index].iso2;
        this.scrollToSelectedOnFocus(index);
      } else if (code === 13) {
        this.onSelectCountry(this.tmpValue);
      } else if (code === 27) {
        this.onClose();
      } else {
        clearTimeout(this.queryTimer);
        this.queryTimer = setTimeout(() => {
          this.query = "";
        }, 1000);
        const q = String.fromCharCode(code);
        if (code === 8 && this.query !== "") {
          this.query = this.query.substring(0, this.query.length - 1);
        } else if (/[a-zA-Z-e ]/.test(q)) {
          this.query += e.key;
          const countries = this.preferredCountries
            ? this.countriesOptions.slice(this.preferredCountries.length)
            : this.countriesOptions;
          const resultIndex = countries.findIndex((c) => {
            this.tmpValue = c.iso2;
            return c.name.toLowerCase().startsWith(this.query);
          });
          if (resultIndex !== -1) {
            this.scrollToSelectedOnFocus(
              resultIndex +
                (this.preferredCountries ? this.preferredCountries.length : 0)
            );
          }
        }
      }
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style scoped lang="scss">
.country-prefix {
  color: var(--color-primary-font);
  font-size: 13px;
}
.phone-input-country__selection.hide {
  opacity: 0;
}
.country-name {
  margin: 0 5px;
}

.phone-input-country {
  padding: 6px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-stroke);
  border-radius: 4px;
  background-color: #fff;
}
.phone-input-country.error {
  border-color: var(--color-red);
}
.enquiry-style .phone-input-country {
  background-color: var(--color-gray-light);
}

.phone-input-country__dropdown {
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  border-radius: 0.25rem;
  overflow-y: auto;
  left: 0;
  right: 0;
  border: 1px solid var(--color-stroke);
  top: calc(100% + 5px);
  max-height: 200px;
  min-height: 39px;
}
@media (min-width: 450px) {
  .finance-request-form .phone-input-country__dropdown {
    max-height: 180px !important;
  }
}
.finance_right .v--modal-box {
  overflow: inherit !important;
}
.dropdown__item-search {
  border-bottom: 1px solid var(--color-stroke);
  display: flex;
  margin-bottom: 5px;
  padding: 0 10px;
  align-items: center;
  position: sticky;
  background: #fff;
  top: 0;
}
.search-code-phone-input {
  border: 0;
  font-size: 13px;
  max-width: 63px;
  background: transparent;
  position: absolute;
  left: 1px;
  right: 1px;
  z-index: -1;
  padding: 0 10px;
  opacity: 0;
}
.show.search-code-phone-input {
  opacity: 1;
  z-index: 1;
}
.search-code-phone-input::placeholder {
  color: var(--color-gray);
  opacity: 0.7;
}
.dropdown__item {
  display: flex;
  align-items: center;
  height: 35px;
  white-space: nowrap;
  padding: 0 10px;
  cursor: pointer;
  gap: 5px;
  background: #fff;
}
.dropdown__item:hover {
  background-color: var(--color-gray-light);
}
.dropdown__item.keyboard-selected {
  background-color: var(--color-gray-light);
}
.dropdown__item.selected {
  background-color: var(--color-primary);
  color: #fff;
  .dropdown-country-code {
    color: #fff;
  }
}
.dropdown__item-nodata {
  font-size: 13px;
  color: var(--color-gray);
  position: absolute;
  z-index: -1;
  top: 0;
  background: #fff;
  width: 100%;
  &:hover {
    background: #fff;
  }
}
.dropdown-country {
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  gap: 5px;
  flex: 1;
  font-size: 13px;
}
.dropdown-country-name {
  max-width: calc(100% - 40px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-country-code {
  color: var(--color-gray);
}
.selecte .dropdown-country-code {
  color: #fff;
}
.phone-input-country__selection {
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 5px;
  font-size: 14px;
}
.selection_dropdown-arrow {
  font-size: 12px;
  color: #bfbfbf;
}
</style>
<style>
@-webkit-keyframes autofill {
  to {
    color: #666;
    background: var(--color-gray-light);
  }
}
input:-webkit-autofill {
  -webkit-animation-name: autofill;
  -webkit-animation-fill-mode: both;
}
</style>
