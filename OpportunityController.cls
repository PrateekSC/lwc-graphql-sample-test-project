public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(Id accountId) {
        return [SELECT Id, Name, CloseDate, StageName, Amount, AccountId 
                FROM Opportunity 
                WHERE AccountId = :accountId];
    }
}
