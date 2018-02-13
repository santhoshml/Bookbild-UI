exports.KEY_USER_OBJECT = 'KEY_USER_OBJECT';
exports.KEY_COMPANY_OBJECT = 'KEY_COMPANY_OBJECT';
// exports.KEY_RFP_LIST_OBJECT = 'KEY_RFP_LIST_OBJECT';
// exports.KEY_RFP_OBJECT = 'KEY_RFP_OBJECT';
// exports.KEY_SELECTED_IOI_OBJECT = 'KEY_SELECTED_IOI_OBJECT';
// exports.KEY_SELECTED_LINK = 'KEY_SELECTED_LINK';
// exports.KEY_SELECTED_FINAL_TERM_SHEET = 'KEY_SELECTED_FINAL_TERM_SHEET';

exports.CURRENCY_OPTS = { format: '%s%v', symbol: '$' }

exports.RFP_EDIT = 'RFP_EDIT';
exports.RFP_NEW = 'RFP_NEW';

exports.IOI_EDIT = 'IOI_EDIT';
exports.IOI_NEW = 'IOI_NEW';

exports.FINAL_TERM_EDIT = 'FINAL_TERM_EDIT';
exports.FINAL_TERM_NEW = 'FINAL_TERM_NEW';

exports.PITCH_NEW = 'PITCH_NEW';
exports.PITCH_EDIT = 'PITCH_EDIT';

exports.KEY_FINANCIAL_SPONSOR='Financial Sponsor';
exports.KEY_LENDER='Lender';
exports.KEY_COMPANY='Company';
exports.KEY_LEGAL_COUNSEL='Legal Counsel';
exports.KEY_3PDD='3rd Part Due Diligence';
exports.KEY_OTHER='Other';
exports.KEY_SUPER_ADMIN='SUPER_ADMIN';

exports.IOI_FOR_RFP = 'IOI_FOR_RFP';
exports.IOI_FOR_COMPANY = 'IOI_FOR_COMPANY';
exports.FT_FOR_RFP = 'FT_FOR_RFP';

exports.RFP_MY_FAVORITES = 'RFP_MY_FAVORITES';
exports.RFP_FOR_COMPANY = 'RFP_FOR_COMPANY';

exports.CUSTOMER_TYPE_OPTIONS = ['Borrower', 'Lender'];
exports.SECTOR_OPTIONS = ['IT', 'Financials', 'Health Care', 'Energy', 'Consumer Staples', 'Consumer Disc', 'Industrials', 'Materials', 'Utilities', 'Telecoms'];
exports.TXN_TYPE_OPTIONS=['New Financing', 'Refinancing', 'Restructuring', 'M&A', 'LBO', 'Market Check'];
exports.YES_NO_OPTIONS = ['Yes', 'No'];
exports.INDUSTRY_OPTIONS = ['Auto Components', 'Automobiles', 'Distributors', 'Diversified Consumer Services', 'Hotels, Restaurants & Leisure', 'Household Durables',
'Internet & Catalog Retail', 'Leisure Products', 'Media', 'Multiline Retail', 'Specialty Retail', 'Textiles, Apparel & Luxury Goods',
'Beverages', 'Food & Staples Retailing', 'Food Products', 'Household Products', 'Personal Products', 'Tobacco', 'Energy Equipment & Services',
'Oil, Gas & Consumable Fuels', 'Banks', 'Capital Markets', 'Consumer Finance', 'Diversified Financial Services', 'Insurance',
'Mortgage REITs', 'Thrifts & Mortgage Finance', 'Biotechnology', 'Health Care Equipment & Supplies', 'Health Care Providers & Services',
'Health Care Technology', 'Life Sciences Tools & Services', 'Pharmaceuticals', 'Aerospace & Defense', 'Air Freight & Logistics', 'Airlines',
'Building Products', 'Commercial Services & Supplies', 'Construction & Engineering', 'Electrical Equipment', 'Industrial Conglomerates',
'Machinery', 'Marine', 'Professional Services', 'Road & Rail', 'Trading Companies & Distributors', 'Transportation Infrastructure',
'Communications Equipment', 'Electronic Equipment, Instruments & Components', 'IT Services', 'Internet Software & Services', 
'Semiconductors & Semiconductor Equipment', 'Software', 'Technology Hardware, Storage & Peripherals', 'Chemicals', 
'Construction Materials', 'Containers & Packaging', 'Metals & Mining', 'Paper & Forest Products', 'Equity Real Estate Investment Trusts',
'Real Estate Management & Development', 'Diversified Telecommunication Services', 'Wireless Telecommunication Services',
'Electric Utilities', 'Gas Utilities', 'Independent Power and Renewable Electricity Producers', 'Multi-Utilities', 'Water Utilities', 'Other'];


exports.QCOMPLIANCE_ROWS = [
    {key : 'revenue', name : 'Revenue'},
    {key : 'minimumRevenue', name : 'Minimum ($)'},
    {key : 'ebitda', name: 'EBITDA'},
    {key : 'minimumEbitda', name : 'Minimum ($)'},
    {key : 'adjustedEbitda', name : 'Adjusted EBITDA'},
    {key : 'minimumAdjustedEbitda', name : 'Minimum ($)'},
    {key : 'seniorLeverage', name : 'Senior Leverage'},
    {key : 'seniorLeverage', name : 'Senior Leverage(x)'},
    {key : 'totalLeverage', name : 'Total Leverage'},
    {key : 'totalLeverage', name : 'Total Leverage(x)'},
    {key : 'interestCoverage', name : 'Interest Coverage'},
    {key : 'minimumSeniorLeverage', name : 'Minimum (0.0x)'},
    {key : 'fixedCharge', name : 'Fixed Charge'},
    {key : 'minimumFixedCharge', name : 'Minimum (0.0x)'},   
    {key : 'availability', name : 'Availability'},
    {key : 'minimumAvailability', name : 'Minimum ($)'},
    {key : 'excessAvailability', name : 'Excess Availability'},
    {key : 'minimumExcessAvailability', name : 'Minimum ($)'},
    {key : 'liquidity', name : 'Liquidity'},
    {key : 'minimumLiquidity', name : 'Minimum ($)'}    
  ];

exports.ROUTES_MAP = {
  MY_PROFILE      : '/myProfile',
  ADD_USER        : '/addUser',
  RFP_MARKETPLACE : '/rfpMarketPlace',
  CREATE_RFP      : '/createRFP',
  EDIT_RFP        : '/editRFP',
  RFP_COMPANY_LIST  : '/rfpCompanyList',
  IOI_LIST        : '/ioiList',
  LOGIN           : '/login',
  SUPER_ADMIN     : '/superAdmin',
  RFP_FAVORITES_LIST  : '/rfpFavoriteList',
  RFP_DETAIL          : '/rfpDetail',
  CREATE_IOI          : '/createIOI',
  EDIT_IOI            : '/editIOI',
  INDUSTRY_RESEARCH   : '/industryResearch',
  REGISTER_COMPANY    : '/registerCompany',
  IOI_DETAIL          : '/ioiDetail',
  LOGOUT              : '/logout',
  WGL                 : '/wgl',
  DOCS                : '/docs',
  QUARTERLY_COMPLIANCE        : '/qCompliance',
  BORROWER_CONTROLLED_ACCESS  : '/borrowerControlledAccess',
  CREATE_FINAL_TERM           : '/createFinalTerm',
  EDIT_FINAL_TERM             : '/editFinalTerm',
  VIEW_FINAL_TERM             : '/finalTermDetail',
  FINAL_TERM_LIST             : '/finalTermList',
  MESSAGES                    : '/messages',
  PRIVATE_DEBT_TRENDS         : '/privateDebtTrends'
};

exports.S3_BUCKET_MAP = {
	LINK_DOCS : 'com.bookbild.link.documents',
};

exports.DOCS_CATEGORY_DISPLAY_NAME_MAP = {
  TXN_NDA           : 'Non-Disclosure Agreement',
  TXN_OVERVIEW  : 'Transaction Overview',
  COMPANY       : 'Company',
  FINANCIAL     : 'Financial',
  LEGAL         : 'Legal',
  OPERATIONS    : 'Operations',
  FINAL_TERM    : 'Final Term Sheet',
};

exports.KEY_ACCESS_CONTROL_DOCUMENTS = 'DOCUMENTS';
exports.KEY_ACCESS_CONTROL_WGL = 'WGL';
exports.KEY_ACCESS_CONTROL_QCOMPLIANCE = 'QCOMPLIANCE';
exports.KEY_ACCESS_CONTROL_DEAL_TEAM = 'DEAL_TEAM';


exports.TXN_OVERVIEW_SAMPLE='Example: $100.0 million senior secured credit facility to refinance existing indebtedness and [fund a dividend recapitalization, tack-on acquisition, etc].';
exports.COMPANY_DESC_SAMPLE='Example: [City], [State]-based provider of open software solutions for mobile enterprises. The company products provide secure access for the next generation of workers, applications, networks, and things. The secure access offered by the Company solutions empowers business productivity by ensuring enterprise IT applications and environments are securely available, whether these are located in the datacenter or in the cloud.';
exports.COVENANTS_SAMPLE = 'Min Excess Availability, Max Senior Leverage, Max Total Leverage, Min EBITDA, Min Revenue, Min Recurring Revenue, Min Interest Coverage, ...';

exports.DISPLAY_VALUES_MAP = {
  // 'new_financing' : 'New Financing',
  // 'refinancing'   : 'Refinancing',
  // 'restructuring' : 'Restructuring',
  // 'ma'            : 'M&A',
  // 'lbo'           : 'LBO',
  // 'abl'           : 'ABL',
  // 'cash_flow'     : 'Cash Flow',
  // 'open'          : 'Open',
  // 'revolver'      : 'Revolver',
  // 'term_loan'     : 'Term Loan',
  // 'mezzanine'     : 'Mezzanine',
  // 'multi-tranche' : 'Multi-Tranche',
  // 'uni-tranche'   : 'Uni-Tranche',
  // 'yes'           : 'YES',
  // 'no'            : 'NO',
  // 'true'          : 'True',
  // 'false'         : 'False'
};

exports.SECTOR_MAP ={
  'it'               : 'IT',
  'financials'       : 'Financials',
  'healthCare'       : 'Health Care',
  'energy'           : 'Energy',
  'consumerStaples' : 'Consumer Staples',
  'consumerDisc'    : 'Consumer Disc',
  'industrials'      : 'Industrials',
  'materials'        : 'Materials',
  'utilities'        : 'Utilities',
  'telecoms'         : 'Telecoms',
  'misc'             : 'Misc'
};

exports.PRODUCT_MAP = {
  'revolver'       : 'Revolver',
  'termLoan'       : 'Term Loan',
  'mezzanine'      : 'Mezzanine',
  'multiTranche'  : 'Multi-Tranche',
  'uniTranche'    : 'Uni-Tranche',
  'misc'           : 'Misc'
};

exports.MESSAGES = {
  RFP_UPDATED : 'RFP_UPDATED',
  RFP_CREATED : 'RFP_CREATED',
  PROFILE_UPDATED : 'PROFILE_UPDATED',
  IOI_CREATED_LENDER : 'IOI_CREATED_LENDER',
  IOI_CREATED_BORROWER : 'IOI_CREATED_BORROWER',
  IOI_EDITED : 'IOI_EDITED',
  FINAL_TERM_CREATED_LENDER : 'FINAL_TERM_CREATED_LENDER',
  FINAL_TERM_CREATED_BORROWER : 'FINAL_TERM_CREATED_BORROWER',
  FINAL_TERM_EDITED : 'FINAL_TERM_EDITED',
  ADD_NEW_USER : 'ADD_NEW_USER',
  WELCOME : 'WELCOME',
  FILE_UPLOADED : 'FILE_UPLOADED',
  ACCESS_QUATERLY_COMPLIANCE : 'ACCESS_QUATERLY_COMPLIANCE',
  ACCESS_DEAL_TEAM : 'ACCESS_DEAL_TEAM',
  ACCESS_DOCUMENTS : 'ACCESS_DOCUMENTS',
  ACCESS_WGL : 'ACCESS_WGL'
};

exports.COMPLIANCE_QUATERLY_COLS = [
  {key: 'type', name: '', formatter : '', resizable: true},
  { key : '1q', name : '1Q', resizable: true},
  { key : '1q-ltm', name : 'LTM', resizable: true},
  { key : '2q', name : '2Q', resizable: true},
  { key : '2q-ltm', name : 'LTM', resizable: true},
  { key : '3q', name : '3Q', resizable: true},
  { key : '3q-ltm', name : 'LTM', resizable: true},
  { key : '4q', name : '4Q', resizable: true},
  { key : 'fy', name : 'FY', resizable: true}
];

exports.COMPLIANCE_MONTHLY_COLS = [
  {key: 'type', name: '', formatter : '', resizable: true},
  { key : 'jan', name : 'Jan', resizable: true},
  { key : 'feb', name : 'Feb', resizable: true},
  { key : 'mar', name : 'Mar', resizable: true},
  { key : '1q', name : '1Q', resizable: true},
  { key : '1q-ltm', name : 'LTM', resizable: true},
  { key : 'apr', name : 'Apr', resizable: true},
  { key : 'may', name : 'May', resizable: true},
  { key : 'jun', name : 'Jun', resizable: true},
  { key : '2q', name : '2Q', resizable: true},
  { key : '2q-ltm', name : 'LTM', resizable: true},
  { key : 'jul', name : 'Jul', resizable: true},
  { key : 'aug', name : 'Aug', resizable: true},
  { key : 'sep', name : 'Sep', resizable: true},
  { key : '3q', name : '3Q', resizable: true},
  { key : '3q-ltm', name : 'LTM', resizable: true},
  { key : 'oct', name : 'Oct', resizable: true},
  { key : 'nov', name : 'Nov', resizable: true},
  { key : 'dec', name : 'Dec', resizable: true},
  { key : '4q', name : '4Q', resizable: true},
  { key : 'fy', name : 'FY', resizable: true}
];

// notifications 

exports.NOTIFICATIONS = {
  LOGIN_FAILED : 'Oops login failed, try again !',
  ADD_USER_SUCCESS : 'User added successfully.',
  ADD_USER_FAILED : 'Failed to add user to the platform, try again.',
  CONTACTUS_FAILED : 'Error sending the email. Please try again.',
  CONTACTUS_SUCCESS : 'Thanks for sending the email. We received it.',
  CREATE_FINAL_TERM_SUCCESS : 'Final term sheet created successfully.',
  CREATE_FINAL_TERM_FAILED : 'Error creating Final term sheet, try again.',
  CREATE_IOI_SUCCESS : 'IOI created successfully.',
  CREATE_IOI_FAILED : 'Error creating IOI, try again.',
  CREATE_RFP_SUCCESS : 'Request for Proposal created successfully.',
  CREATE_RFP_FAILED : 'Error creating your Request for Proposal, try again.',  
  EDIT_FINAL_TERM_FAILED : 'Error editing your Final Term sheet, try again.',
  EDIT_FINAL_TERM_SUCCESS : 'Your Final Term sheet updated.',
  EDIT_IOI_FAILED : 'Error editing your IOI, try again',
  EDIT_IOI_SUCCESS : 'Your IOI updated.',
  EDIT_RFP_FAILED : 'Error editing your Request for Proposal, try again',
  EDIT_RFP_SUCCESS : 'Your Request for Proposal updated.',
  INVITE_COMPANY_FAILED : 'Invite Company failed, try again',
  INVITE_COMPANY_SUCCESS : 'Invite Company email sent',
  REGISTER_COMPANY_FAILED : 'Register Company failed, try again',
  REGISTER_COMPANY_SUCCESS : 'Register Company successful',
  ADD_TO_FAVORITES_SUCCESS : 'Added to your favorites',
  ADD_TO_FAVORITES_FAILED : 'Error adding to your favorites',
  REMOVE_FROM_FAVORITES_SUCCESS : 'Removed from your favorites',
  REMOVE_FROM_FAVORITES_FAILED : 'Error removing from your favorites',
  USER_PROFILE_SUCCESS : 'User Profile updated.',
  USER_PROFILE_FAILED : 'Error updating your profile, try again.',

};