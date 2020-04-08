/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateService = /* GraphQL */ `
  subscription OnCreateService {
    onCreateService {
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
export const onUpdateService = /* GraphQL */ `
  subscription OnUpdateService {
    onUpdateService {
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
export const onDeleteService = /* GraphQL */ `
  subscription OnDeleteService {
    onDeleteService {
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
export const onCreateContract = /* GraphQL */ `
  subscription OnCreateContract {
    onCreateContract {
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
export const onUpdateContract = /* GraphQL */ `
  subscription OnUpdateContract {
    onUpdateContract {
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
export const onDeleteContract = /* GraphQL */ `
  subscription OnDeleteContract {
    onDeleteContract {
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
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense {
    onCreateExpense {
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
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense {
    onUpdateExpense {
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
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense {
    onDeleteExpense {
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
