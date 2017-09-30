exports.KEY_USER_OBJECT = 'KEY_USER_OBJECT';
exports.KEY_COMPANY_OBJECT = 'KEY_COMPANY_OBJECT';
exports.KEY_RFP_LIST_OBJECT = 'KEY_RFP_LIST_OBJECT';
exports.KEY_RFP_OBJECT = 'KEY_RFP_OBJECT';
exports.KEY_SELECTED_IOI_OBJECT = 'KEY_SELECTED_IOI_OBJECT';
exports.KEY_SELECTED_LINK = 'KEY_SELECTED_LINK';

exports.CURRENCY_OPTS = { format: '%s%v', symbol: '$' }

exports.RFP_EDIT = 'RFP_EDIT';
exports.RFP_NEW = 'RFP_NEW';

exports.IOI_EDIT = 'IOI_EDIT';
exports.IOI_NEW = 'IOI_NEW';
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

exports.RFP_MY_FAVORITES = 'RFP_MY_FAVORITES';
exports.RFP_FOR_COMPANY = 'RFP_FOR_COMPANY';

exports.CUSTOMER_TYPE_OPTIONS = ['Borrower', 'Lender'];
exports.SECTOR_OPTIONS = ['IT', 'Financials', 'Health Care', 'Energy', 'Consumer Staples', 'Consumer Disc', 'Industrials', 'Materials', 'Utilities', 'Telecoms'];
exports.TXN_TYPE_OPTIONS=['New Financing', 'Refinancing', 'Restructuring', 'M&A', 'LBO', 'Market Check'];
exports.YES_NO_OPTIONS = ['Yes', 'No'];

exports.QCOMPLIANCE_ROWS = [
  'Min Adj EBITDA',
  'Max Leverage',
  'GAAP Revenue',
  'GAAP Gross Margin',
  'GAAP Operating Income',
  'Non-GAAP EBITDA'
];

exports.ROUTES_MAP = {
  MY_PROFILE      : '/myProfile',
  ADD_USER        : '/addUser',
  RFP_MARKETPLACE : '/rfpMarketPlace',
  CREATE_RFP      : '/createRFP',
  RFP_COMPANY_LIST  : '/rfpCompanyList',
  IOI_LIST        : '/ioiList',
  LOGIN           : '/login',
  SUPER_ADMIN     : '/superAdmin',
  RFP_FAVORITES_LIST  : '/rfpFavoriteList',
  RFP_DETAIL          : '/rfpDetail',
  CREATE_IOI          : '/createIOI',
  INDUSTRY_RESEARCH   : '/industryResearch',
  REGISTER_COMPANY    : '/registerCompany',
  IOI_DETAIL          : '/ioiDetail',
  LOGOUT              : '/logout',
  WGL                 : '/wgl',
  DOCS                : '/docs',
  QUARTERLY_COMPLIANCE : '/qCompliance'
};

exports.S3_BUCKET_MAP = {
	LINK_DOCS : 'com.bookbild.link.documents',
};

exports.DOCS_CATEGORY_DISPLAY_NAME_MAP = {
  TXN_OVERVIEW  : 'Transaction Overview',
  COMPANY       : 'Company',
  FINANCIAL     : 'Financial',
  LEGAL         : 'Legal',
  OPERATIONS    : 'Operations'
};

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
