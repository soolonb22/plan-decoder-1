import { CORE_TRIAL_DAYS, MEMBERSHIP_PRICE_AUD } from "./billing";

/**
 * One shared free / account / Core boundary for the homepage and /rights.
 * Do not claim the full rights course is free.
 */
export const ACCESS_BOUNDARY = `Without an account you can read the glossary, NDIS news, and rights Module 0. A free account adds a basic diary and the plan checklist. Core ($${MEMBERSHIP_PRICE_AUD.core} a month after a ${CORE_TRIAL_DAYS}-day trial) is needed for the practice assessment, the full rights course, Easy Read, and a certificate.`;
