import {
  Login,
  SignUp,
  Confirm,
  RequestResetPassword,
  ResetPassword,
  RequestReconfirm
} from '../views';

export default {
  login: {
    path: '/login',
    component: Login,
    linkText: 'Log In'
  },
  signup: {
    path: '/sign-up',
    component: SignUp,
    linkText: 'Sign Up'
  },
  requestReconfirm: {
    path: '/confirmation/new',
    component: RequestReconfirm,
    linkText: 'Resend Confirmation Instructions'
  },
  confirm: {
    path: '/confirmation',
    component: Confirm
  },
  requestResetPassword: {
    path: '/password/new',
    component: RequestResetPassword,
    linkText: 'Reset Your Password'
  },
  resetPassword: {
    path: '/password/edit',
    component: ResetPassword
  }
};
