import { LightningElement, wire, track } from 'lwc';
import { graphql, gql } from 'lightning/uiGraphQLApi';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';


const GET_ACCOUNTS_QUERY = gql`
  query {
    uiapi {
      query {
        Account(first: 1000) {
          edges {
            node {
              Id
              Name {
                value
              }
              Phone {
                value
              }
              Contacts {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`;

const GET_OPPORTUNITIES_QUERY = gql`
  query getOpportunities($accountIds: [ID!]) {
    uiapi {
      query {
        Opportunity(where: { AccountId: { in: $accountIds } }) {
          edges {
            node {
              Id
              Name {
                value
              }
              CloseDate {
                value
              }
              StageName {
                value
              }
              Amount {
                value
              }
            }
          }
        }
      }
    }
  }
`;

export default class AccountContactOpportunityDashboard extends LightningElement {
    @track accounts = [];
    @track opportunities = [];
    @track selectedAccountName = '';
    @track loadingOpportunities = false;
    doesWireOppNeedsCall = false;
    @track accountIds = [];
    @track opportunityToDisplay = [];
    accountColumns = [
        { label: 'Account Name', fieldName: 'name' },
        { label: 'Phone', fieldName: 'phone' },
        { label: 'Contact Count', fieldName: 'contactCount', type: 'number' },
        {
        type: 'action',
        typeAttributes: { rowActions: [{ label: 'View Opportunities', name: 'view_opportunities' }] }
        }
    ];

    opportunityColumns = [
        { label: 'Opportunity Name', fieldName: 'name' },
        { label: 'Stage', fieldName: 'stage' },
        { label: 'Amount', fieldName: 'amount', type: 'currency' },
        { label: 'Close Date', fieldName: 'closeDate', type: 'date' }
    ];

    get opportunityVariables() {
        return {
        accountIds: this.accountIds
        };
    }
    get cardTitle() {
            return `Opportunities for '${this.selectedAccountName}'`;
        }
 
    @wire(graphql, { query: GET_ACCOUNTS_QUERY })
    wiredAccounts({ errors, data }) {
        if (data) {
        this.accounts = data.uiapi.query.Account.edges.map(({ node }) => ({
            id: node.Id,
            name: node.Name?.value,
            phone: node.Phone?.value,
            contactCount: node.Contacts.totalCount
        })).filter(account => account.contactCount > 0);
        this.accountIds.push(...this.accounts.map(account => account.id));
        } else if (errors) {
        console.error('Account fetch error', errors);
        }
    }

    handleRowAction(event) {
        console.log('Action event:', event.detail);
        console.log('RowAction event:', JSON.stringify(event.detail));
    const action = event.detail.action.name;
    const row = event.detail.row;
      console.log('Action:', event.detail.action.name);
    if (!row) {
        console.error('Row is undefined. Check key-field or data mapping.');
        return;
    }
    if (action === 'view_opportunities' && row !== undefined) {
        this.selectedAccountName = row.name;
        const accId = row.id;
        console.log('Account Id:', accId);
        console.log('selectedAccountName :', this.selectedAccountName);
        this.doesWireOppNeedsCall = true;
        getOpportunities({ accountId: accId })
        .then(result => {
            console.log('result'+JSON.stringify(result));
            result.forEach(opp => console.log('opp:', opp.Name));
            this.opportunityToDisplay = result.map(opp => ({
            id: opp.Id,
            name: opp.Name,
            closeDate: opp.CloseDate,
            stage: opp.StageName,
            amount: opp.Amount,
            accountId: opp.AccountId
            }));
        });
        console.log(
            'opportunityToDisplay:',
            JSON.stringify(this.opportunityToDisplay));
    }
  }

    @wire(graphql, { query: GET_OPPORTUNITIES_QUERY, variables: '$opportunityVariables'})
    wiredOpportunities({ errors, data }) {
        if (data) {
            console.log('Raw GraphQL response:', JSON.stringify(data, null, 2));
                    
            const opportunitiesData = data?.uiapi?.query?.Opportunity?.edges;
            console.log('opportunitiesData:', opportunitiesData);
            if (!opportunitiesData) {
                console.warn('No opportunity data found in response.');
                this.opportunities = [];
                return;
            }
            this.opportunities = opportunitiesData.map(({ node }) => ({
                id: node.Id,
                name: node.Name?.value,
                closeDate: node.CloseDate?.value,
                stage: node.StageName?.value,
                amount: node.Amount?.value,
                contact: node.Contact__c?.value
            }));
            console.log('Opportunities:', JSON.stringify(this.opportunities));
        } else if (errors) {
            console.error('Error fetching opportunities', errors);
            this.opportunities = [];    
        }
    }


}
