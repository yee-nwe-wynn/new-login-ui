<template>
  <div>
    <div class="login-form__container">
      <div class="login-form__wrap box">
        <!-- phone login form -->
        <div v-if="showLoginForm">
          <div class="close-login"></div>
          <div class="box-part" id="bp-left">
            <div class="login-form">
              <div class="header-login__title">
                {{ translates.signUpOrLogIn }}
              </div>
              <div class="body-login">
                <div class="login-title">
                  {{ translates.getTheFullExperience }}
                </div>
                <div class="login-sub-title">
                  {{ translates.saveYourFavorites }}
                </div>
                <!--login with phone number -->
                <form autocomplete="off" v-if="isShowPhoneNumberForm">
                  <phone-input
                    v-model="phoneNumber"
                    :code="defaultCountryCode"
                    :errorMessage="errorMessage"
                    :isPhoneNumberTaken="isPhoneNumberTaken"
                    :placeholder="translates.phone"
                    @verify-number-clicked="handleVerifyNumberClick"
                  ></phone-input>
                </form>
                <!--login with phone number -->

                <!--login with email-->
                <form autocomplete="off" v-if="isShowEmailForm">
                  <text-input
                    v-model="email"
                    :placeholder="translates.email"
                    :errorMessage="errorMessage"
                  />
                </form>
                <!--login with email-->

                <button
                  class="btn btn-primary-continue mt-10"
                  v-on:click="validateAndProceed"
                >
                  <loading-animation
                    v-if="isContinueSubmit"
                  ></loading-animation>
                  <span v-else>{{ translates.continue }}</span>
                </button>
                <div class="login-text-or">
                  <span class="login-text-or__span">{{ translates.or }}</span>
                </div>
                <div class="btn-social-group">
                  <button class="large-btn btn-social btn-facebook">
                    {{ translates.continueWithFacebook }}
                  </button>
                  <button class="large-btn btn-social btn-google">
                    {{ translates.continueWithGoogle }}
                  </button>
                  <button class="large-btn btn-social btn-line">
                    {{ translates.continueWithLine }}
                  </button>
                  <button
                    class="large-btn btn-social btn-email"
                    v-on:click="showEmailForm"
                    v-if="!isShowEmailForm"
                  >
                    {{ translates.continueWithEmail }}
                  </button>

                  <button
                    class="large-btn btn-social btn-phone"
                    v-on:click="showPhoneNumberForm"
                    v-if="!isShowPhoneNumberForm"
                  >
                    {{ translates.continueWithPhone }}
                  </button>
                  <!-- Add other social buttons as needed -->
                </div>
              </div>

              <div class="body-login-footer">
                <small
                  class="form-bottom__inner"
                  v-html="translates.agreeToFazwaz"
                ></small>
              </div>
            </div>
          </div>
        </div>
        <!-- phone login form -->

        <!-- Password form -->
        <div class="login-form" v-if="showPasswordForm">
          <div class="header-login__title">
            <div class="go-back-login" v-on:click="onGoBackToSignIn" />
            {{ translates.loginWithPhone }}
          </div>
          <div class="body-login">
            <form autocomplete="off">
              <password-input
                v-model="password"
                ref="passwordInput"
                :placeholder="translates.password"
                :is-text-btn="true"
                :text-show="translates.show"
                :text-hide="translates.hide"
              ></password-input>
              <div v-if="submitErrorMessage" class="errors-message is-invalid">
                {{ submitErrorMessage }}
              </div>
              <button class="btn btn-primary-continue mt-10">
                <loading-animation v-if="isLoginSubmit"></loading-animation>
                <span v-else>{{ translates.login }}</span>
              </button>
            </form>
          </div>
          <div class="body-login-footer forgot-footer">
            <div class="forgot-password" v-on:click="onForgotPasswordClick">
              {{ translates.forgotPassword }}?
            </div>
          </div>
        </div>
        <!-- Finish Password form -->

        <!-- Forgot Password form -->
        <div class="login-form" v-if="showForgotPasswordForm">
          <div class="header-login__title">
            <div class="go-back-login" v-on:click="onGoBackToSignIn" />
            {{ translates.forgotPassword }}
          </div>
          <div class="body-login">
            <form autocomplete="off">
              <span class="partition-sub-title">{{
                translates.textSubForgetPass
              }}</span>
              <text-input
                v-model="email"
                :placeholder="translates.email"
                :errorMessage="emailErrorMessage"
              />
              <button
                class="btn btn-primary-continue mt-10"
                v-on:click="onForgotPasswordSubmit"
              >
                <loading-animation
                  v-if="isForgotPasswordSubmit"
                ></loading-animation>
                <span v-else>{{ translates.sendPasswordResetLink }}</span>
              </button>
            </form>
          </div>
        </div>
        <!-- Finish Forgot Password form -->

        <!-- signing up form -->
        <div class="login-form" v-if="showSignUpForm">
          <div class="header-login__title">
            <div class="go-back-login" v-on:click="onGoBackToSignIn" />
            {{ translates.finishSigningUp }}
          </div>
          <div class="body-login">
            <text-input
              v-model="firstName"
              :placeholder="translates.firstName"
              :errorMessage="nameErrorMessage"
              :hideErrorMessage="true"
              class="wrap__input-text--first"
            />
            <text-input
              v-model="lastName"
              :placeholder="translates.lastName"
              :errorMessage="nameErrorMessage"
              class="wrap__input-text--last"
            />
            <phone-input
              v-model="phoneNumber"
              className="signup-phone__input"
              :grouped="true"
              :code="defaultCountryCode"
              :errorMessage="errorMessage"
              :placeholder="translates.phone"
            ></phone-input>

            <div class="otp-information">
              {{ translates.weWillTextYouToConfirmYourNumber }}
            </div>

            <text-input
              v-model="email"
              :placeholder="translates.email"
              :errorMessage="emailErrorMessage"
            />
            <password-input
              v-model="password"
              ref="passwordInput"
              :placeholder="translates.password"
              :is-text-btn="true"
              :text-show="translates.show"
              :text-hide="translates.hide"
              :errorMessage="passwordErrorMessage"
            ></password-input>

            <!-- will implement Captcha here -->
            <div class="captcha_wrap"></div>

            <div v-if="submitErrorMessage" class="errors-message is-invalid">
              {{ submitErrorMessage }}
            </div>
            <button class="btn btn-primary-continue" v-on:click="onSignUpClick">
              <loading-animation v-if="isSingUpSubmit"></loading-animation>
              <span v-else>{{ translates.signUp }}</span>
            </button>
          </div>
          <div class="body-login-footer signup-footer">
            {{ translates.weWillNeverShareInfo }}
          </div>
        </div>
        <!-- finish signing up form -->

        <!-- otp form -->
        <div class="login-form" v-if="showOtpForm">
          <div class="header-login__title">
            <div
              class="go-back-login"
              v-if="isDuplicatedPhone"
              v-on:click="onGoBackToSignIn"
            />
            <div
              class="go-back-login"
              v-else
              v-on:click="onGoBackToSignUpForm"
            />
            {{ translates.pleaseValidatePhoneNumber }}
          </div>
          <div class="body-login">
            <div class="get-code__wrap">
              <phone-input
                v-model="phoneNumber"
                :code="defaultCountryCode"
                :errorMessage="errorMessage"
                :placeholder="translates.phone"
              ></phone-input>
              <button class="btn btn-get-code" v-on:click="onGetCode">
                <loading-animation v-if="isGetCodeSubmit"></loading-animation>
                <span v-else> {{ translates.getCode }} </span>
              </button>
            </div>
            <text-input
              v-model="otpCode"
              :type="'number'"
              :errorMessage="otpCodeErrorMessage"
              :placeholder="translates.phoneValidationCode"
            ></text-input>
            <button class="btn btn-primary-continue" v-on:click="onSubmit">
              {{ translates.submit }}
            </button>
          </div>
        </div>
        <!-- finish otp form -->
      </div>
    </div>
    <div class="chat-box-container" v-if="showLoginForm">
      <label class="checkbox-label">
        <input
          type="checkbox"
          class="verify-checkbox"
          v-model="isPhoneNumberTaken"
        />
        Will check phone duplication (testing)
      </label>
    </div>
  </div>
</template>

<script>
import TextInput from "./TextInput.vue";
import PhoneInput from "./PhoneInput/PhoneInput.vue";
import PasswordInput from "./PasswordInput.vue";
import LoadingAnimation from "./LoadingAnimation.vue";
export default {
  components: {
    TextInput,
    PhoneInput,
    PasswordInput,
    LoadingAnimation,
  },
  data() {
    return {
      // Hard-coded data for testing
      translates: {
        signUpOrLogIn: "Sign up or Log in",
        loginWithPhone: "Login with Phone",
        continue: "Continue",
        getTheFullExperience: "Get the full experience",
        saveYourFavorites:
          "Save your favorites, schedule viewings, make offers and get access to member-only deals.",
        continueWithFacebook: "Continue with Facebook",
        continueWithGoogle: "Continue with Google",
        or: "or",
        email: "Email",
        continueWithEmail: "Continue with Email",
        continueWithLine: "Continue with Line",
        continueWithPhone: "Continue with Phone",
        agreeToFazwaz:
          "By continuing, you agree to the Fazwaz's <a href='http://fazwaz.test/about/privacy' target='_blank'><u>privacy policy</u></a>",
        phone: "Phone",
        password: "Password",
        login: "Log in",
        show: "Show",
        hide: "Hide",
        signUp: "Sign up",
        submit: "Submit",
        forgotPassword: "Forgot Password",
        finishSigningUp: "Finish signing up",
        firstName: "First Name",
        lastName: "Last Name",
        weWillNeverShareInfo:
          "We'll never share your information with any third parties",
        pleaseValidatePhoneNumber: "Please validate your phone number",
        weWillTextYouToConfirmYourNumber:
          "We'll text you to confirm your number.",
        getCode: "Get Code",
        phoneValidationCode: "Phone Validation Code",
        sendPasswordResetLink: "Send Password Reset Link",
        textSubForgetPass:
          "Please enter your email below and a link to reset your password will be sent there.",
        phoneNumberAlreadyTaken: "Phone number is already taken.",
      },
      phoneNumber: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      otpCode: "",
      isShowEmailForm: false,
      isShowPhoneNumberForm: true,
      isLoginSubmit: false,
      isContinueSubmit: false,
      isSingUpSubmit: false,
      isForgotPasswordSubmit: false,
      isSubmittingEmail: false,
      isGetCodeSubmit: false,
      isPhoneNumberTaken: false,
      isDuplicatedPhone: false,
      defaultCountryCode: "th",
      errorMessage: "",
      nameErrorMessage: "",
      emailErrorMessage: "",
      passwordErrorMessage: "",
      otpCodeErrorMessage: "",
      submitErrorMessage: "",
      showLoginForm: true,
      showPasswordForm: false,
      showSignUpForm: false,
      showOtpForm: false,
      showForgotPasswordForm: false,
    };
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    resetForm() {
      this.email = "";
      this.phoneNumber = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.otpCode = "";
      this.errorMessage = "";
      this.nameErrorMessage = "";
      this.emailErrorMessage = "";
      this.passwordErrorMessage = "";
      this.otpCodeErrorMessage = "";
      this.submitErrorMessage = "";
    },
    resetSignUpForm() {
      this.email = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.otpCode = "";
      this.errorMessage = "";
      this.nameErrorMessage = "";
      this.emailErrorMessage = "";
      this.passwordErrorMessage = "";
      this.otpCodeErrorMessage = "";
      this.submitErrorMessage = "";
    },
    showEmailForm() {
      this.resetForm();
      this.isShowEmailForm = true;
      this.isShowPhoneNumberForm = false;
    },
    showPhoneNumberForm() {
      this.resetForm();
      this.isShowPhoneNumberForm = true;
      this.isShowEmailForm = false;
    },
    validateAndProceed() {
      this.errorMessage = "";
      if (this.isPhoneNumberTaken) {
        this.errorMessage = this.translates.phoneNumberAlreadyTaken;
        return;
      }
      if (this.isShowPhoneNumberForm && this.phoneNumber !== "") {
        this.isContinueSubmit = true;
        setTimeout(() => {
          this.isGetCodeSubmit = this.showLoginForm = false;
          // this.showPasswordForm = true;
          this.showSignUpForm = true;
          this.resetSignUpForm();
        }, 1000);
      } else if (this.isShowPhoneNumberForm) {
        this.errorMessage = "Please enter a valid phone number";
      }

      if (this.isShowEmailForm && this.email !== "") {
        this.isContinueSubmit = true;
        setTimeout(() => {
          this.isGetCodeSubmit =
            this.showLoginForm =
            this.showForgotPasswordForm =
              false;
          this.showPasswordForm = true;
        }, 1000);
      } else if (this.isShowEmailForm) {
        this.errorMessage = "Please enter your email";
      }
    },
    onGoBackToSignIn() {
      this.showLoginForm = true;
      this.showPasswordForm =
        this.showSignUpForm =
        this.showOtpForm =
        this.showForgotPasswordForm =
        this.isGetCodeSubmit =
        this.isContinueSubmit =
        this.isDuplicatedPhone =
          false;
    },
    onGoBackToSignUpForm() {
      this.showOtpForm = false;
      this.showSignUpForm = true;
    },
    onForgotPasswordClick() {
      this.showForgotPasswordForm = true;
      this.showPasswordForm = false;
    },
    onSignUpClick() {
      if (this.firstName === "" || this.lastName === "") {
        this.nameErrorMessage = "Please enter your first name & last name.";
      }
      if (this.email === "") {
        this.emailErrorMessage = "Please enter your email.";
      }
      if (this.password === "") {
        this.passwordErrorMessage =
          "Please enter a password between 6 and 50 characters.";
      }
      if (
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.email !== "" &&
        this.password !== ""
      ) {
        this.nameErrorMessage =
          this.emailErrorMessage =
          this.passwordErrorMessage =
            "";
        this.isSingUpSubmit = true;
        setTimeout(() => {
          this.showOtpForm = true;
          this.otpCode = "";
          this.showSignUpForm =
            this.showLoginForm =
            this.isSingUpSubmit =
              false;
        }, 1000);
      }
    },
    onGetCode() {
      this.isGetCodeSubmit = true;
      setTimeout(() => {
        this.isGetCodeSubmit = false;
      }, 1000);
    },
    onForgotPasswordSubmit() {
      this.isForgotPasswordSubmit = true;
      setTimeout(() => {
        this.isForgotPasswordSubmit = false;
      }, 1000);
    },
    onSubmit() {
      if (this.otpCode === "") {
        this.otpCodeErrorMessage = "Please enter your otp code.";
      } else {
        this.otpCodeErrorMessage = "";
        this.isLoginSubmit = true;
        setTimeout(() => {
          this.isLoginSubmit = false;
        }, 1000);
      }
    },
    handleVerifyNumberClick() {
      this.showOtpForm = this.isDuplicatedPhone = true;
      this.showLoginForm = this.isPhoneNumberTaken = false;
      this.errorMessage = this.otpCode = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form__container {
  max-width: 342px;
  margin: 0 auto;
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 8px;
}
.login-form__wrap {
  position: relative;
  background: white;
  overflow: auto;
  border-radius: 4px;
  margin-bottom: 15px;
}

.header-login__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary-font);
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-stroke);
}
.login-title {
  text-align: center;
  color: var(--color-primary-font);
  font-size: 17px;
  font-weight: 600;
}

.login-sub-title {
  text-align: center;
  color: var(--color-secondary-font);
  font-size: 13px;
  margin-bottom: 15px;
}
.body-login {
  padding: 15px;
}
.btn-social-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logo-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.login-text-or {
  position: relative;
  display: block;
  margin: 10px 0;

  &::before {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #ccc;
    left: 0;
    right: 0;
    transform: translate(0, -50%);
    content: "";
  }
}
.login-text-or__span {
  width: 32px;
  height: 32px;
  line-height: 28px;
  text-align: center;
  margin: 0 auto;
  background: #fff;
  display: block;
  position: relative;
  z-index: 1;
}

.btn-social {
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  outline: none;
  position: relative;
  transition: all 0.4s;
  width: 100%;
  border-width: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-social:before {
  content: "";
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin-left: 10px;
  position: absolute;
  left: 0;
}

.btn-facebook:before {
  background-image: url(/images/icon/login-facebook.svg);
}

.btn-google:before {
  background-image: url(/images/icon/login-google.svg);
}
.btn-line:before {
  background-image: url(/images/icon/login-line.svg);
}
.btn-email:before {
  background-image: url(/images/icon/email-solid.svg);
}

.btn-phone:before {
  background-image: url(/images/icon/login-tel.svg);
}
.btn-wechat:before {
  background-image: url(/images/icon/we_chat_icon.svg);
}

.btn-primary-continue {
  background-color: var(--color-primary);
  color: #fff;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100%;
}
.btn-primary-continue:hover {
  background-color: var(--color-primary);
  color: #fff;
}
.mt-10 {
  margin-top: 10px;
}
.close-login {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  width: 44px;
  height: 44px;
  background: url(/images/icon/close-black.svg) no-repeat center center / 15px;
  z-index: 999;
}

.form-bottom__inner a {
  color: #726e6e !important;
}

.go-back-login {
  width: 44px;
  height: 44px;
  left: 0;
  top: 0;
  text-align: -webkit-right;
  position: absolute;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  &:after {
    content: "";
    transform: rotate(135deg);
    border: solid var(--color-primary-font);
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 5px;
  }
}
.body-login-footer {
  text-align: center;
}

.form-bottom__inner a {
  color: var(--color-secondary-font) !important;
  font-size: 13px;
}

.privacy-policy {
  color: #726e6e;
}

.signup-footer {
  font-size: 12px;
  padding-left: 30px;
  padding-right: 30px;
}
.forgot-footer {
  margin-left: 15px;
}
.forgot-password {
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
  text-align: start;
  color: var(--color-primary);
}
.otp-information {
  display: flex;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: var(--color-secondary-font);
  width: 100%;
  margin-top: 5px;
  margin-bottom: 10px;
}
.get-code__wrap {
  display: flex;
}
.btn-get-code {
  background-color: var(--color-primary-font);
  color: #fff;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 12px;
  font-weight: 600;
  margin-left: 5px;
  margin-bottom: 10px;
  max-height: 33px;
  max-width: 70px;
  &:hover {
    background-color: black;
    color: white;
  }
}
.partition-sub-title {
  color: var(--color-secondary-font);
  text-align: center;
  font-size: 13px;
  margin-bottom: 0.5rem;
  display: block;
}
.captcha_wrap {
  height: 74px;
}

.chat-box-container {
  max-width: 342px;
  margin: 20px auto; /* Adjust margin as needed */
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
.verify-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
