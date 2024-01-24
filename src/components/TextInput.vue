<template>
  <div class="wrap__input-text" v-if="active !== false">
    <input
      :type="type"
      :name="name"
      class="form-control"
      :class="{ 'is-invalid': errorMessage }"
      :maxlength="maxlength"
      v-model="currentTextValue"
      autocomplete="off"
      :placeholder="placeholder"
      v-on:change="onChange"
    />
    <div
      v-if="errorMessage && !hideErrorMessage"
      class="errors-message is-invalid"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: [
    "name",
    "label",
    "value",
    "type",
    "maxlength",
    "active",
    "placeholder",
    "subName",
    "subLabel",
    "subOptions",
    "subValue",
    "errorMessage",
    "hideErrorMessage",
  ],
  data() {
    const { value } = this;
    return {
      textValue: value || "",
    };
  },
  computed: {
    currentTextValue: {
      set(value) {
        const { maxlength } = this;
        this.textValue = value;
        if (maxlength) {
          this.textValue = value.substring(0, maxlength);
        }
      },
      get() {
        return this.textValue;
      },
    },
  },
  watch: {
    value(after, before) {
      if (after !== before) {
        this.textValue = after;
      }
    },
  },
  methods: {
    onChange() {
      const { textValue } = this;
      console.log("Text value:", this.textValue);
      this.$emit("input", textValue);
    },
  },
};
</script>

<style scoped lang="scss">
.wrap__input-text {
  margin-bottom: 0.5rem;
  width: 100%;
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
.wrap__input-text input {
  font-size: 13px;
}

.wrap__input-text--first {
  margin-bottom: 0;
  input {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    border-bottom: 0;
  }
  input:focus {
    border-bottom: none;
  }
}

.wrap__input-text--last {
  input {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
}
.invalid-feedback.is-invalid,
.errors-message.is-invalid {
  display: flex !important;
}
.form-control.is-invalid {
  background-image: none !important;
}
//temp
.form-control:focus {
  border: 1px solid var(--color-stroke);
  box-shadow: none;
}
</style>
