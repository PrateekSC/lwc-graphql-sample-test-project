# lwc-graphql-sample-test-project

Here's a `README.md` file for your Lightning Web Component (LWC) that provides a clear explanation of the component's purpose, technologies used, and how to use it:

---

# Account Contact Opportunity Dashboard - LWC

This Lightning Web Component (LWC) displays Salesforce **Accounts** and allows users to **view related Opportunities** for a selected account. It integrates **GraphQL** for querying account and opportunity data, and also uses an **Apex controller** to fetch opportunities based on selected account.

---

## Technologies Used

* **LWC (Lightning Web Components)**
* **GraphQL (via `lightning/uiGraphQLApi`)**
* **Apex Method (`getOpportunities`)**
* **Salesforce UI API**
* **Wire Adapters (`@wire`)**
* **Track Decorators (`@track`)**

---

## Files Overview

### `accountContactOpportunityDashboard.js`

Handles logic to:

* Fetch account and opportunity data using GraphQL
* Fetch opportunities via Apex when an account is selected
* Manage UI state and handle user interactions

### `accountContactOpportunityDashboard.html`

(You need to create this separately)
Expected to display:

* A `lightning-datatable` of accounts
* A `lightning-card` showing opportunities for selected account

---

## 🚀 Features

* Display list of Accounts with Phone and Contact Count
* etch and display Opportunities based on selected Account
* Uses GraphQL to query UI API schema
* Dynamic title for selected Account using computed property
* Apex fallback to retrieve Opportunities

