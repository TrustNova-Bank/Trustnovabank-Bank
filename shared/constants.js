/* =====================================
   TRUSTNOVA BANK
   SHARED CONSTANTS
===================================== */

const APP_NAME = "TrustNova Bank";

const CUSTOMER_LOGIN_PAGE = "login.html";
const CUSTOMER_DASHBOARD_PAGE = "dashboard.html";

const ADMIN_LOGIN_PAGE = "admin-login.html";
const ADMIN_DASHBOARD_PAGE = "admin.html";

const TABLES = {
    USERS: "users",
    ADMINS: "admins",
    ACCOUNTS: "accounts",
    TRANSACTIONS: "transactions",
    SUPPORT_TICKETS: "support_tickets",
    AUDIT_LOGS: "audit_logs",
    EXCHANGE_RATES: "exchange_rates",
    FIXED_DEPOSITS: "fixed_deposits",
    CURRENCIES: "currencies",
    USER_ROLES: "user_roles"
};

const ROLES = {
    CUSTOMER: "customer",
    ADMIN: "admin"
};

const TRANSACTION_TYPES = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    TRANSFER: "transfer",
    PAYMENT: "payment"
};

const TRANSACTION_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    CANCELLED: "cancelled"
};

const ACCOUNT_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
    CLOSED: "closed"
};

const DEFAULT_CURRENCY = "USD";
