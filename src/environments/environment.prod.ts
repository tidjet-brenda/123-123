export const environment = {
    production: true,
    hmr: false,
    reCaptcheKey: '6LfxCaUZAAAAAMNOCJKL6mdYNf4wHtWGlC_GjXC7',
    ENDPOINTS: {
        LOGIN_URL: '/auth/login',
        CSRF_URL: '/auth/hello',
        ACTIVATE_ACCOUNT_URL: '/uaa/api/activate',
        FORGOT_PASSWORD_URL: '/uaa/api/account/reset-password-employee/init',
        RESET_PASSWORD_URL: '/uaa/api/account/reset-password/finish',
        USER_PROFILE_URL: '/companymanagement/api/employees/my-profile',
        CHANGE_PASSWORD_URL: '/uaa/api/account/change-password',
        LOGOUT_URL: '/auth/logout',

        PAY_COMPANY_URL: '/pay/api/companies',
        MONTH_POINTING: '/month-pointing/pointing',
        DAYPOINTING_URL: '/day-pointing/mine',
        LEAVE_URL: '/leave-requests/mine',
        LEAVE_URL_BY_ID: '/leave-requests/',
        EMPLOYEE_EXERCISES_URL: '/leave/mine',
        LEAVE_REQUESTS_URL: '/leave-requests/mine',

        COMPANY_MANAGEMENT_COMPANY_URL: '/companymanagement/api/companies',
        GET_ABSENCE_URL: '/absences/mine',
        GET_SINGLE_ABSENCE_URL: '/absences',

        EMPLOYEE_ATTACHEMENT_URL: '/companymanagement/api/attachments',
        WILAYAS_URL: '/companymanagement/api/wilayas',
        COMMUNES_URL: '/companymanagement/api/communes',
        PROFESSION_URL: '/companymanagement/api/professions',
        EMPLOYEE_PAY_URL: '/payslips/mine',
        EMPLOYEE_PROFILE_ATTACHMENT: '/employee-attachments',
        NOTIFICATION_URL: '/uaa/api/employee-notifications',

        EMPLOYEE_QRC_CODE_POINTING: '/qr-codes',
        WEEK_END_DAYS: '/week-end-days',
        SCHEDULE_URL:'/pay/api/companies'

    }
};
