<template>
  <div class="password-input__wrap" v-if="active !== false">
    <input
      :type="type"
      :name="name"
      class="form-control password-input"
      :class="{ 'is-invalid': errorMessage }"
      v-model="textValue"
      :placeholder="placeholder"
      ref="input"
      v-on:change="onChange"
    />
    <div v-if="isTextBtn" class="toggle-btn__wrapper">
      <span v-if="type === 'password'" @click="onShowPasswordClick">{{
        textShow
      }}</span>
      <span v-else @click="onShowPasswordClick">{{ textHide }}</span>
    </div>
    <i
      v-else
      :class="{ 'i-eye': type === 'password', 'i-eye-close': type === 'text' }"
      @click="onShowPasswordClick"
    />
    <div v-if="errorMessage" class="errors-message is-invalid">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PasswordInput",
  props: [
    "name",
    "label",
    "value",
    "active",
    "placeholder",
    "subName",
    "subLabel",
    "subOptions",
    "subValue",
    "errorMessage",
    "isTextBtn",
    "textShow",
    "textHide",
  ],
  data() {
    const { value } = this;
    return {
      textValue: value || "",
      type: "password",
    };
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
      this.$emit("input", textValue);
    },
    onShowPasswordClick() {
      const { type } = this;
      if (type === "password") {
        this.type = "text";
      } else {
        this.type = "password";
      }
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.password-input__wrap {
  margin-bottom: 0.5rem;
  position: relative;
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  } /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  i {
    position: absolute;
    right: 10px;
    top: 12px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    &.i-eye {
      background: url(/images/icon/icon-eye.png) no-repeat left top / cover;
      opacity: 0.4;
    }
    &.i-eye-close {
      background: url(/images/icon/icon-eye-close.png) no-repeat left top /
        cover;
      opacity: 0.4;
    }
  }
  .password-input {
    font-size: 13px;
  }
  .toggle-btn__wrapper {
    position: absolute;
    font-size: 11px;
    right: 5px;
    top: 5px;
    cursor: pointer;
    text-decoration: underline;
    text-align: end;
    padding: 6px;
    border-radius: 4px;
  }
}
.form-control.is-invalid {
  background-image: none !important;
}
//temp
.form-control:focus {
  border: 1px solid var(--color-stroke);
  box-shadow: none;
}

// .rtl-direction {
//   .password-input__wrap i {
//     right: auto;
//     left: 10px;
//   }
//   .toggle-btn__wrapper {
//     left: 15px;
//     right: auto;
//   }
// }
</style>
