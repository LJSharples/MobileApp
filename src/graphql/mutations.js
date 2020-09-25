/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addProfile = /* GraphQL */ `
  mutation AddProfile(
    $user_name: String
    $full_name: String
    $first_name: String
    $last_name: String
    $phone: String
  ) {
    addProfile(
      user_name: $user_name
      full_name: $full_name
      first_name: $first_name
      last_name: $last_name
      phone: $phone
    ) {
      user_name
      full_name
      first_name
      last_name
      phone
    }
  }
`;
export const addCompany = /* GraphQL */ `
  mutation AddCompany(
    $user_name: String
    $company_name: String
    $site_id: Int
    $address1: String
    $address2: String
    $city: String
    $company_number: String
    $postcode: String
    $region: String
    $years_trading: String
    $num_employees: String
    $yearly_turnover: String
    $industry: String
  ) {
    addCompany(
      user_name: $user_name
      company_name: $company_name 
      site_id: $site_id
      address1: $address1
      address2: $address2
      city: $city
      company_number: $company_number
      postcode: $postcode
      region: $region
      years_trading: $years_trading
      num_employees: $num_employees
      yearly_turnover: $yearly_turnover
      industry: $industry
    ) {
      user_name
      site_id
      address1
      address2
      city
      company_number
      postcode
      region
      years_trading
      
    }
  }
`;
export const addLead = /* GraphQL */ `
  mutation AddLead(
    $user_name: String
    $first_name: String
    $last_name: String
    $full_name: String
    $phone: String
  ) {
    addLead(
      user_name: $user_name
      first_name: $first_name
      last_name: $last_name
      full_name: $full_name
      phone: $phone
    ) {
      first_name
      last_name
      phone
      full_name
    }
  }
`;
export const addService = /* GraphQL */ `
  mutation AddService(
    $user_name: String
    $status: String
    $service_name: String
    $callback_time: String
    $contract_end: String
    $contract_length: String
    $current_supplier: String
    $cost_month: String
    $cost_year: String
    $uploaded_documents: String
  ) {
    addService(
      user_name: $user_name
      status: $status
      service_name: $service_name
      callback_time: $callback_time
      contract_end: $contract_end
      contract_length: $contract_length
      current_supplier: $current_supplier
      cost_month: $cost_month
      cost_year: $cost_year
      uploaded_documents: $uploaded_documents
    ) {
      user_name
      status
      service_name
      callback_time
      contract_end
      contract_length
      cost_month
      cost_year
      current_supplier
      request_costs
      uploaded_documents
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation updateUser(
    $user_name: String
    $full_name: String
    $first_name: String
    $last_name: String
    $phone: String
  ){
    updateUser(
      user_name: $user_name
      full_name: $full_name
      first_name: $first_name
      last_name: $last_name
      phone: $phone
  ) {
    user_name
    full_name
    first_name
    last_name
    phone
  }
}
`;
export const updateCompany = /* GraphQL */ `
  mutation upateCompany(
    $user_name: String
    $company_name: String
    $company_number: String
    $address1: String
    $address2: String
    $city: String
    $postcode: String
    $region: String
    $years_trading: String
    $num_employees: String
    $yearly_turnover: String
    $industry: String
  ){
    updateCompany(
      user_name: $user_name
      company_name: $company_name
      company_number: $company_number
      address1: $address1
      address2: $address2
      city: $city
      postcode: $postcode
      region: $region
      years_trading: $years_trading
      num_employees: $num_employees
      yearly_turnover: $yearly_turnover
      industry: $industry
  ) {
    user_name
    address1
    address2
    city
    postcode
    region
    num_employees
  }
}
`;
export const removeService = /* GraphQL */ `
  mutation removeService(
    $user_name: String
    $id: String
  ){
    deleteService(
      id: $id
      user_name: $user_name
  ){
    user_name
    id
  }
}
`;