/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createService = /* GraphQL */ `
  mutation CreateService(
    $input: CreateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    createService(input: $input, condition: $condition) {
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
export const updateService = /* GraphQL */ `
  mutation UpdateService(
    $input: UpdateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    updateService(input: $input, condition: $condition) {
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
export const deleteService = /* GraphQL */ `
  mutation DeleteService(
    $input: DeleteServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    deleteService(input: $input, condition: $condition) {
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
export const createContract = /* GraphQL */ `
  mutation CreateContract(
    $input: CreateContractInput!
    $condition: ModelContractConditionInput
  ) {
    createContract(input: $input, condition: $condition) {
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
export const updateContract = /* GraphQL */ `
  mutation UpdateContract(
    $input: UpdateContractInput!
    $condition: ModelContractConditionInput
  ) {
    updateContract(input: $input, condition: $condition) {
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
export const deleteContract = /* GraphQL */ `
  mutation DeleteContract(
    $input: DeleteContractInput!
    $condition: ModelContractConditionInput
  ) {
    deleteContract(input: $input, condition: $condition) {
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
export const createExpense = /* GraphQL */ `
  mutation CreateExpense(
    $input: CreateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    createExpense(input: $input, condition: $condition) {
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
export const updateExpense = /* GraphQL */ `
  mutation UpdateExpense(
    $input: UpdateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    updateExpense(input: $input, condition: $condition) {
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
export const deleteExpense = /* GraphQL */ `
  mutation DeleteExpense(
    $input: DeleteExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    deleteExpense(input: $input, condition: $condition) {
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
