<template>
  <div
    class="phone-input__wrap"
    :class="`${className || ''} input-phone`"
    v-if="active !== false"
  >
    <div
      v-bind:class="['input-phone__wrap', { 'input-phone__grouped': grouped }]"
    >
      <country-search-dropdown
        :grouped="grouped"
        :error="errorMessage"
        :focus="isFocus"
        :disabled="disabled"
        :code="selectedCode"
        :prefix.sync="prefix"
      />
      <input
        :ref="refName"
        v-model="phoneNumber"
        class="input-phone__input form-control"
        :class="{
          'is-invalid': errorMessage,
          'input-phone__input-no-data': !phoneNumber || phoneNumber === '',
        }"
        :placeholder="placeholder"
        pattern="[0-9]*"
        inputmode="tel"
        :disabled="disabled"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        type="tel"
      />
    </div>
    <div class="invalid-feedback" :class="{ 'is-invalid': errorMessage }">
      {{ errorMessage }}
      <a
        class="verify-number"
        v-if="isPhoneNumberTaken"
        v-on:click="onVerifyNumberClick"
        >Verify Number</a
      >
    </div>
  </div>
</template>

<script>
import CountrySearchDropdown from "./CountrySearchDropdown";
import getFilterNumber from "../../assets/js/helpers/converter/getFilterNumber";
import { getPhoneData, getPhonePrefix } from "../../assets/js/helpers/phone";

export default {
  name: "PhoneInput",
  components: { CountrySearchDropdown },
  props: [
    "active",
    "refName",
    "name",
    "code",
    "value",
    "errorMessage",
    "placeholder",
    "className",
    "disabled",
    "grouped",
    "isPhoneNumberTaken",
  ],
  data() {
    const { code = "us", value } = this;
    const phoneNumber = value ? getPhoneData(value) : {};
    const { number, country } = phoneNumber;
    const newCode = country ? country.toLowerCase() : undefined;
    const selectedCode = newCode || code;
    const prefix = getPhonePrefix(selectedCode);
    return {
      selectedCode: selectedCode,
      prefix: prefix,
      phoneNumber: number || "",
      isFocus: false,
    };
  },
  mounted() {
    if (this.value) {
      this.filterPrefix(this.value);
    }
  },
  watch: {
    selectedCode(after, before) {
      if (after !== before) {
        this.$emit("update:code", after);
      }
    },
    prefix(after, before) {
      if (after !== before) {
        const newValue = `${after}${this.phoneNumber}`;
        this.onEmitInputEvent(newValue);
      }
    },
    phoneNumber(after, before) {
      if (after !== before) {
        this.filterPrefix(after);
        const newValue = `${this.prefix}${after}`;
        this.onEmitInputEvent(newValue);
      }
    },
    value(after, before) {
      if (after !== before) {
        this.filterPrefix(after);
      }
    },
    code(after, before) {
      if (after !== before) {
        this.selectedCode = after;
      }
    },
  },
  methods: {
    onEmitInputEvent(value) {
      const { prefix } = this;
      const newValue = value === prefix ? null : value;
      this.$emit("input", newValue);
    },
    onInput() {
      this.phoneNumber = this.phoneNumber.replace(/\D/g, "");
    },
    onBlur(e) {
      this.$emit("blur", e);
      this.isFocus = false;
    },
    onFocus() {
      this.isFocus = true;
    },
    filterPrefix(value = "") {
      const { prefix } = this;
      this.phoneNumber = "";
      this.prefix = "";
      const valueNotNull = value === null ? "" : value;
      const isPrefixContain = valueNotNull.includes(prefix);
      if (isPrefixContain) {
        const phoneNumber = valueNotNull.replace(prefix, "");
        this.phoneNumber = getFilterNumber(phoneNumber);
      } else {
        const { nationalNumber } = getPhoneData(valueNotNull);
        this.phoneNumber = nationalNumber ? nationalNumber : valueNotNull;
      }
      this.prefix = prefix;
    },
    onVerifyNumberClick() {
      this.$emit("verify-number-clicked");
    },
  },
};
</script>

<style scoped lang="scss">
.input-phone__wrap {
  width: 100%;
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 5px;
}

.input-phone__grouped {
  display: block;
}
.signup-phone__input .input-phone__input {
  padding: 8px 15px;
  border-start-start-radius: 0;
  border-start-end-radius: 0;
  border-top: 0;
}
.signup-phone__input .input-phone__input:focus {
  border-top: 0;
}
.signup-phone__input .phone-input-country {
  padding: 8px;
  border-end-start-radius: 0;
  border-end-end-radius: 0;
}

.input-phone__input {
  font-size: 13px;
  //border: 1px solid var(--color-stroke);
  &.is-invalid {
    border-color: var(--color-red);
    background-image: none;
  }
}
.login-phone-input .input-phone__input {
  padding: 8px 15px;
  border-start-start-radius: 0;
  border-start-end-radius: 0;
}
input.form-control:focus {
  outline: none !important;
}
.invalid-feedback.is-invalid,
.errors-message.is-invalid {
  display: flex !important;
}
//temp
.form-control:focus {
  border: 1px solid var(--color-stroke);
  box-shadow: none;
}
.verify-number {
  color: #007bff !important;
  text-decoration: underline !important;
  font-size: 13px;
}
</style>
