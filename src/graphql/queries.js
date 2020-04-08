/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      business
      name
      provider
      contracts {
        items {
          id
          eac
          length
          contractStart
          contractEnd
        }
        nextToken
      }
    }
  }
`;
export const listServices = /* GraphQL */ `
  query ListServices(
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        business
        name
        provider
        contracts {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getContract = /* GraphQL */ `
  query GetContract($id: ID!) {
    getContract(id: $id) {
      id
      eac
      length
      contractStart
      contractEnd
      service {
        id
        business
        name
        provider
        contracts {
          nextToken
        }
      }
      expenses {
        items {
          id
          value
          paidDate
        }
        nextToken
      }
    }
  }
`;
export const listContracts = /* GraphQL */ `
  query ListContracts(
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        eac
        length
        contractStart
        contractEnd
        service {
          id
          business
          name
          provider
        }
        expenses {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
      id
      value
      paidDate
      contract {
        id
        eac
        length
        contractStart
        contractEnd
        service {
          id
          business
          name
          provider
        }
        expenses {
          nextToken
        }
      }
    }
  }
`;
export const listExpenses = /* GraphQL */ `
  query ListExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        value
        paidDate
        contract {
          id
          eac
          length
          contractStart
          contractEnd
        }
      }
      nextToken
    }
  }
`;
