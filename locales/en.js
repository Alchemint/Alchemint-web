export default {
  nav: {
    individual: 'Individual',
    institution: 'Institution',
    wallet: 'Wallet',
    tools: 'Tools',
    lock: 'Staking',
    account: 'Account',
    logout: 'Log Out',
    help: 'Help',
    termsService: 'Terms of Service',
    userManual: 'User Manual',
    video: 'Video Tutorial',
    contact: 'Contact Us',
    //maintenanceState: 'The system is currently in maintenance state and is not recommended for use. It is expected to return to normal before 15:00 on X, X, Singapore time.',
    maintenanceState: 'The system is currently in maintenance state and is not recommended for use. ',

  },
  login: {
    json: 'Import Keystore',
    pwd: 'Password',
    wif: 'Please input your private key',
    loginByKey: 'By Private Key',
    loginByJson: 'By KeyStore',
    loginByCold: 'By Cold Wallet',
    coldWalletInfo: '<li>Connect Cold Wallet</li>' +
      '<li>Open NEO APP</li>',
    jsonErr: 'Keystore or password incorret',
    wifErr: 'Key is incorret, try again'
  },
  register: {
    wallet: 'Wallet name',
    pwd: 'Password',
    confirmPwd: 'Confirm password',
    walletErr: 'Please input no more than 20 letters, numbers or symbols ',
    pwdErr: 'Please input no more than 20 letters, numbers or symbols',
    confirmPwdErr: 'Password do not match',
    succTitle: 'Your Keystore file has been generated. Be sure to download and keep your Keystore file!',
    succInfo: '<li>Once the Keystore file is lost, it cannot be recovered by the platform.</li>\n' +
      '          <li>You can log in by Keystore file + password or merely by the private key.</li>',
    downLoadBtn: 'Download Keystore File',
  },
  lock: {
    title: 'Staking',
    openTit: 'Open a staking account',
    openBtn: ' Open a staking account ',
    benefitAddrTit: 'Multi-chain Earning Addresses',
    benefitAddr: ' Earning Address',
    addAddrBtn: 'Add',
    editBtn: 'Modify',
    inputPhl: 'Please Input',
    basic: {
      title: 'Basic Information ',
      type: "Type",
      additionalBenefits: 'Additional Earning',
      benefit: ' Earning',
      status: 'Status',
      operation: 'Operation',
      deposit: 'Deposit',
      draw: 'Withdraw',
      lockNum: 'Staking Quantity',
      remainTime: 'Remaining Time',
      withDrawSds: ' Withdraw SDS',
      withDrawSdsInfo: 'You will withdraw all the staking SDS in this period to your wallet.',
      depositLock: ' SDS Staking Deposit',
      depositLockNum: 'Staking Quantity',
      depositInfoTit: 'Prompt',
      depositInfo: 'Once the deposition is made for this period, it cannot be changed until the end of the countdown. Only afterwards will you be able to withdraw or deposit. '
    },
    history: {
      title: 'History',
      assetAddr: 'Asset Address',
      type: 'Type',
      lockType: 'Staking Type',
      quantity: 'Quantity',
      lockTime: 'Operation Time',
      TX: 'TX',
    }
  },
  wallet: {
    asset: 'Assets',
    transfer: 'Transfer',
    lock: 'Lock',
    walletInfo: 'Wallet Information',
    myAddr: 'My wallet address',
    myWif: 'My key',
    assetBalance: 'My Assets',
    currency: 'Currency',
    balance: 'Balance',
    unitPrice: 'Unit Price',
    totalValue: 'Total Value',
    transferInfo: 'This wallet supports all assets on the NEO chain including all Nep-5; non-NEO chain assets are not supported at this moment, please do not send BTC or ETH to this wallet.',
    transferAsset: 'Asset',
    toAddress: 'Address',
    toAddressPhl: 'Please input the receiving address',
    amount: 'Quantity',
    amountPhl: 'Please input the receiving quantity',
    transferHistory: 'Transfer History',
    from: 'From',
    to: 'To',
    bSystemInfo: 'SAR-B smart contract operation',
    cSystemInfo: 'SAR-C smart contract operation',
    errAddr: 'Wrong information',
    category: {
      sarB: 'SAR-B Stablecoin',
      global: 'Global Assets',
      tranType: 'Transaction Type',
    },
    liquidate: {
      title: 'Liquidate',
      sar: 'Tum',
      sds: 'Into',
      info: 'is in your account. Please check'
    },
    transferModal: {
      title: 'Confirm Transfer',
      amount: 'You are about to send',
      to: 'To',
      fee: 'Network fee',
    }
  },
  individual: {
    statusInfo: '<li>when"0&lt;SAR mortgage rates &lt; {lineRate}%", the status of SAR is displayed as "Critical"; </li>' +
      '<li>when "{lineRate}%&lt;=SAR mortgage rates &lt;{topRate}%", SAR status is shown as "Unsafe";</li>' +
      '<li>when "SAR mortgage rate&gt;= {topRate}%, SAR", status is displayed as "Safe".</li>',
    relevantAssets: {
      title: 'Relevant Assets',
      type: 'Type',
      quantity: 'Quantity',
      price: 'Price',
      value: 'Value',
    },
    neoToSneo: {
      amountToInput: 'Amount to input',
      amountToGet: 'Amount to get',
      info: '<li>Due to the fact that the minimum unit of NEO is 1. Its segmentation is not allowed. Thus SNEO is needed as collateral for calculation purpose. The minimum unit of SNEO is 0.00000001. The exchange ratio between NEO and SNEO is constantly 1: 1.</li>' +
        '<li>At any time, user can freely convert SNEO to NEO and vice versa in Alchemint platform.</li>' +
        '<li>If the conversion fails due to improper operation (manual refresh during the block confirmation process or webpage closure) and the quantity of SNEO or NEO gets smaller, please contact us via the email at the bottom of the screen.</li>',
      warnTitle: 'ATTENTION',
      warnInfo: '<li>Do not manually turn off or refresh this page!</li>' +
        '<li>Otherwise the conversion may fail and the quantity might be wrong!</li>' +
        '<li>Please wait patiently till two 30s countdown on the right is over.</li>',
      transferAgain: 'Conversion is unsuccessful, please click',
      transferAgainBtn: 'Continue Convert',
      transferAgainTitle: 'Continue Converting SNEO->NEO',
      continueBtn: 'Continue',
      warnTip: 'Since “SNEO->NEO” needs two consecutive blocks to confirm transactions, a page refresh or shutdown during the conversion process leads to transaction interruption and quantity display problem. If this happens, please click &#91Continue Conversion] to continue the conversion task that was originally interrupted. After the blocks are confirmed, the quantity will return to normal.'
    },
    systemStatus: {
      title: 'System Status',
      sneoTotal: 'Total SNEO Collateralized',
      sdusdTotal: 'Total SDUSD Issued',
      allRate: 'Overall Mortgage Rate',
      liquidateRate: 'Liquidation Trigger Rate',
      liquidateDis: 'Liquidation Discount',
      issuingRate: 'Annual Fee Rate',
      deptTop: 'Overall Issueing Ceiling (SDUSD)',
      feePaid: 'Total Service Fee Paid (SDS)',
      predictFeeTotal: "Total Service Fee To Be Paid(SDS)"
    },
    sarCList: {
      title: 'Overall SAR-C List',
      sdusdIssued: 'SDUSD Issued',
      sdusdRemained: 'SDUSD Issuable',
      sneoCollateralized: 'SNEO Collateralized',
      sneoDrawable: 'SNEO Drawable',
      mortageRate: 'SAR Mortage Rate',
      liquidationPrice: 'Liquidation Trigger Price(SNEO)',
      status: 'SAR Status',
      history: 'History',
      liquidate: 'Liquidate',
      all: 'All',
      filter: 'Filter',
    },
    mySar: {
      title: 'My SAR',
      createSar: 'Create SAR',
      sdusdRemained: 'SDUSD Issuable',
      sneoDrawable: 'SNEO Drawable',
      sarRate: 'SAR Mortgage Rate',
      feeBalance: 'SDS Balance',
      status: 'SAR Status',
      sdusdIssued: 'SDUSD Issued',
      sneoCollateralized: 'SNEO Collateralized',
      liquidationPrice: 'Liquidation Trigger Price(SNEO)',
      feeGenerated: 'Fee To Be Paid (SDS) ',
      fee: 'Fee',
      insufficientFee: 'SDS Insufficient,Please recharge before returning',
      increase: 'Add SNEO',
      draw: 'Draw SNEO',
      issue: 'Issue SDUSD',
      return: 'Return SDUSD',
      recharge: 'Add SDS',
      refund: 'Draw SDS',
      history: 'History',
      closeSar: 'Close SAR',
      closeSarSure: 'Are you sure to close？',
      closeSarInfo: 'History will disappear after closing and you will no longer be able to view it.',
      rechargeInfo: 'Returning SDUSD requires service fee paid by SDS. Please make sure there are enough SDS in your SAR.',
      afterMortgageRate: 'Mortgage Rate',
      afterStatus: 'Status',
      liquidationRiskInfo: 'If the mortgage rate is below {topRate}%, the liquidation risk is greater.',
      riskModal: {
        title: 'Risk Warning',
        infoTitle: 'If the mortgage rate is below {topRate}%, the liquidation risk is greater.',
        infoDetail: '<li>If NEO price falls by 15%, your SAR mortgage rate will fall by 22.5%-30%.</li>' +
          '<li style="margin-top: 10px">If the mortgage rate falls below {lineRate}%, your SAR can be liquidated by others. At the same time, the system will automatically deduct a certain amount of fine according to the liquidation amount and the settlement discount.</li>',
        cancelBtn: 'Let me think about it',
        confirmBtn: 'I understand the risks and continue to execute',
      },
      quickSarModal: {
        title: 'One-click Issue',
        collateralizeNeo: 'Collateralize NEO',
        issueSdusd: 'Issue SDUSD',
      },
      quickSarInfo: '<li>This function automatically performs multiple steps（NEO->SDUSD）.</li>' +
        '<li> If the page is closed or manually refreshed during the process, the automation will be interrupted. But the assets are not affected and you can manually continue with the unfinished steps.</li>'
    },
    myBond: {
      title: 'My BOND',
      bondUsed: 'BOND Used',
      sneoLocked: 'SNEO  Locked ',
      liquidate: 'Liquidate',
      payBack: 'Pay Back',
      history: 'History',
      historyTitle: 'BOND Operation History'
    },
    liquidateModal: {
      title: 'Liquidation',
      sdusdAmount: 'SDUSD Qty to Input ',
      bondAmount: 'Bond Qty to Input',
      sneoAmount: 'SNEO Qty to Get',
      value: 'Value',
      afterLiq: 'Mortage rate after liquidation',
      afterStatus: 'Status after liquidation',
      info: '<li>When a single SAR mortgage rate is below {lineRate}%, the system will display a “Liquidation” button.</li>' +
        '<li>You can use SDUSD to liquidate part of the collateral.</li>' +
        '<li>If a single settlement makes the mortgage rate rise to {lineRate}%-{topRate}%, the liquidation cannot be continued.</li>'
    }
  },
  institution: {
    relevantAssets: 'Relevant Assets',
    stableCoinsMarket: 'Stablecoins Market',
    currency: 'Currency',
    circulation: 'Circulation',
    type: 'Type',
    peg: 'Peg',
    margin: 'Margin',
    sdsMargin: 'SDS Margin',
    marginRate: 'Margin Rate',
    status: 'Status',
    operation: 'Operating',
    assetPrice: 'Asset Price',
    name: 'Name',
    lastestPrice: 'Lastest Price',
    mySar: 'SAR-B',
    createSar: 'Create SAR',
    issue: 'Issue',
    reture: 'Return',
    startSar: 'Start SAR',
    closeSar: 'Close SAR',
    increaseMargin: 'Increase Margin',
    drawMargin: 'Draw Margin',
    history: 'History',
    createCoin: {
      modalTitle: 'Create Coin Name',
      name: 'Name',
      namePhl: 'Input the name suffix 3-5 capital',
      nameErr: 'Name taken',
      type: 'Anchor Asset Type',
      typePhl: 'Choose anchoring asset type'
    },
    launchCoin: {
      modalTitle: 'Launch SAR',
      info: ' <li>Launching SAR requires 10 SDS as a start-up deposit.</li>\n' +
        '     <li>The start-up deposit is also counted as part of the collateral.</li>\n' +
        '     <li>When you close SAR, the start-up deposit will be automatically refunded to your account.</li>'
    },
    issuePhl: 'Input issue amount',
    returePhl: 'Input return amount',
    increaseMarginPhl: 'Input margin amount to be increased',
    drawMarginPhl: 'Input margin amount to be drawn',
    drawMarginInfo: '<li>There are 10 SDS start-up deposit in the margin which cannot be directly withdrawal.</li>\n' +
      '        <li>The start-up deposit will be automatically refunded to your account when you close SAR.</li>',
    closeSarInfo: '<li>History will disappear after closing and you will no longer be able to view it.</li>\n' +
      '        <li>The coin name will be available on the market.</li>\n' +
      '        <li>The start-up deposit will be automatically refunded to your account.</li>\n' +
      '        <li>Preconditon for closing : The circulation is 0; The amount of margin is exactly 10.</li>'
  },
  global: {
    loading: 'Loading',
    loginBtn: 'Log in',
    loginBtn1: 'Login',
    registerBtn: 'Register',
    otherwise: 'or',
    copy: 'copy',
    display: 'display',
    hide: 'hide',
    liquidate: 'Liq.',
    confirmBtn: 'Confirm',
    cancelBtn: 'Cancel',
    all: 'ALL',
    perPageNum: 'Show',
    row: 'Row',
    noData: 'No Data',
    copySucc: 'Copy Succeed',
    copyErr: 'Copy Error',
    history: {
      sarOperationHistory: 'SAR Operation History',
      liquidatioOperationHistory: 'Liquidation Operation History',
      date: 'Date',
      operation: 'Operation',
      quantity: 'Quantity',
      tx: 'TX',
    },
    fee: 'Fee',
    feeInfo: 'This transaction will be prioritized(Pay 0.001 GAS)',
  },
  tools: {
    contractAddr: {
      title: 'Contract Address',
      blockHeight: 'Block Height',
      sdusdAddr: 'SDUSD Address',
      sar4CAddr: 'SAR4C Address',
      oracleAddr: 'Oracle Address',
      sdsAddr: 'SDS Address',
      sar4BAddr: 'SAR4B Address',
      tokenAddr: 'Tokenized Asset Address',
    },
    browse: {
      title: 'Explorer',
      search: 'Search',
      searchPhl: 'Search for address / transaction id',
      assetInfo: 'Assets Info',
      transactionInfo: 'Transaction information',
      txid: 'TXID',
      type: 'Type',
      netFee: 'Network Fee',
      sysFee: 'System Fee',
      size: 'Size',
      height: 'Height',
      time: 'Time',
      input: 'Input',
      address: 'Address',
      asset: 'Asset',
      output: 'Output',
      from: 'From',
      to: 'To',
      value: 'Value',
    }
  },
  envs: [
    {
      name: "neo",
      label: 'Main net'
    },
    {
      name: "testNet",
      label: 'Test net'
    },
    {
      name: "pri",
      label: 'Private net'
    }
  ],
  anchorTypes: [
    {
      value: 'anchor_type_usd',
      label: 'USD'
    },
    {
      value: 'anchor_type_eur',
      label: 'EUR'
    },
    {
      value: 'anchor_type_jpy',
      label: 'YEN'
    },
    {
      value: 'anchor_type_gbp',
      label: 'GBP'
    },
    {
      value: 'anchor_type_gold',
      label: 'GOLD'
    },
  ],
  sarCStatus: [
    {
      value: '0',
      label: '--'
    },
    {
      value: '1',
      label: 'Safe'
    },
    {
      value: '2',
      label: 'Unsafe'
    },
    {
      value: '3',
      label: 'Critical'
    }
  ],
  sarBStatus: [
    {
      value: 1,
      label: 'Safe'
    },
    {
      value: 2,
      label: 'Can not use'
    },
    {
      value: 3,
      label: 'Unsafe'
    }
  ],
  sarBTypes: [
    {
      value: 1,
      label: 'Create SAR'
    },
    {
      value: 2,
      label: 'Start SAR'
    },
    {
      value: 3,
      label: 'Increase Margin'
    },
    {
      value: 4,
      label: 'Issue'
    },
    {
      value: 5,
      label: 'Draw Margin'
    },
    {
      value: 6,
      label: 'Return'
    },
    {
      value: 7,
      label: 'Close SAR'
    },
    {
      value: 8,
      label: 'Liquidate'
    },
    {
      value: 9,
      label: 'Destroy'
    }
  ],
  sarCTypes: [
    {
      value: 1,
      label: 'Create SAR'
    },
    {
      value: 2,
      label: 'Add SNEO'
    },
    {
      value: 3,
      label: 'Issue SDUSD'
    },
    {
      value: 4,
      label: 'Draw SNEO'
    },
    {
      value: 5,
      label: 'Return SDUSD'
    },
    {
      value: 6,
      label: 'Close SAR'
    },
    {
      value: 7,
      label: 'Liquidated'
    },
    {
      value: 8,
      label: '转移所有权'
    },
    {
      value: 9,
      label: 'BOND Liquidate'
    },
    {
      value: 10,
      label: 'Pay Back'
    },
    {
      value: 11,
      label: 'Add SDS'
    },
    {
      value: 12,
      label: '签收清算资产'
    },
    {
      value: 13,
      label: 'Draw SDS'
    },
  ],
  faq: {
    title: 'Frequently Asked Questions',
    search: 'Search',
    /*'desc-1': {
      question: 'What\'s the process for issuing stablecoin SDUSD?',
      answer: '<div>You will need AT LEAST 1 NEO or more to use Alchemint stablecoin issuance platform to issue stablecoin SDUSD.</div>\n' +
        '<div>The process of issuing SDUSD are:</div>' +
        '<ol style="margin: 0">' +
        '<li>Convert NEO into SNEO</li>' +
        '<li>Deposite SNEO into SAR</li>' +
        '<li>Issue SDUSD</li>' +
        '</ol>'
    },
    'desc-2': {
      question: 'What\'s Mortgage rate?',
      answer: 'Mortgage Rate = Value of SNEO Collateralized / Value of SDUSD Issued',
    },
    'desc-3': {
      question: 'What\'s different SAR status mean?',
      answer: '<ul>' +
        '<li>Critical: when mortgage rate < 150%, SAR creator needs to add more collateral or return SDUSD to increase the mortgage rate as soon as possible, otherwise others can liquidate this SAR to “help” increasing the mortgage rate.</li>' +
        '<li>Unsafe: when150%< mortgage rate <200%, SAR creator is highly suggested to add more collateral or return SDUSD to increase the mortgage rate in order to avoid the SAR becoming Critical status.However, in this status, others can’t liquid this SAR.</li>' +
        '<li>Safe: when mortgage rate >=200%, status is displayed as "Safe ".The risk of being liquidated is relatively low.</li>' +
        '</ul>'
    },
    'desc-4': {
      question: 'What\'s the process for returing stablecoin SDUSD?',
      answer: '<div>The process of returning SDUSD are:' +
        '<ol>' +
        '<li>Deposit SDS</li>' +
        '<li>Click \'Return SDUSD\' and select the amount</li>' +
        '<li>Withdraw SNEO from SAR</li>' +
        '<li>Convert SNEO back to NEO</li>' +
        '</ol>' +
        '</div>',
    },
    'desc-5': {
      question: 'What can l do if my SAR collateral rate is low?',
      answer: '<div>When the mortgage rate is low, you can choose one of the following ways to increase your mortgage rate:<ol>' +
        '<li>Add collateral SNEO</li>' +
        '<li>Return SDUSD</li>' +
        '</ol></div>',
    },
    'desc-6': {
      question: 'What can I do when someone else’s SAR mortgage rate is less than 150%? What good is it for me?',
      answer: '<div>When someone else\'s SAR is below the 150% mortgage rate, you can participate in liquidation. Any user holding SDUSD and having opened SAR can participate in the linquidation and obtain the corresponding mortgage assets at a lower discount. The maximum mortgage rate can be linquidated to 160%. However, when the mortgage rate rises to 150% or above after liquidation, the SAR will no longer be allowed to be liquidated.</div>' +
        '<div>The price of NEO obtained by the clearing house is 10% lower than the market price.</div>',
    },
    'desc-7': {
      question: 'What is the recommended mortgage rate?',
      answer: 'We suggest the mortgage rate to be as high as possible with minimum 200%.',
    },
    'desc-8': {
      question: 'What is SNEO? ',
      answer: 'SNEO: due to the fact that the minimum unit of NEO is 1. Its segmentation is\n' +
        'not allowed. Thus SNEO is needed for calculation purpose. The minimum unit\n' +
        'of SNEO is 0.00000001. The exchange ratio between NEO and SNEO is\n' +
        'constantly 1: 1. At any time, user can freely convert SNEO to NEO and vice versa\n' +
        'in Alchemint platform.'
    },
    'desc-9': {
      question: 'What\'s collateral fee? ',
      answer: 'mortgage is calcualted based on how many SDUSD the SAR owner issued, it will be paid in SDS',
  },
    'desc-10': {
      question: 'How to calcualte the collateral fee?',
      answer: '<div>How to calculated the collateral fee:</div>' +
        '<div>(Current block height - The block height in which SDUSD is issued) * SDUSD return amount * Mortgage rate / SDS market price</div>',
    },
    'desc-11': {
      question: 'What\'s the current rate of collateral fee?',
      answer: 'The current mortgage fee is 2%,Alchemint foundation will modify the mortgage fee based on platform development status and NEO’s market price.'
    },
    'desc-12': {
      question: 'If I collateral NEO, will I get the GAS generated from my NEO?',
      answer: 'Yes',
    },
    'desc-13': {
      question: 'What\'s the mechanism of GAS distrubution?',
      answer: 'In general, the GAS generated for the NEO in the wallet is distributed at the beginning of each month. The GAS generated for SNEO will not be distributed for the time being. At the beginning of the next month after SNEO is converted to NEO, the system will distribute the accumulated GAS to users at one time.',
    },
    'desc-14': {
      question: 'How does the system feed the market price for NEO and SDS?',
      answer: '<div>' +
        '<div>At present, 10 NEO feed nodes have been selected, the system will perform real-time sorting, and the median will be used as the system feed price. The system will update the price of one of the nodes in order every 6 minutes.</>' +
        '<div>The price of the SDS is taken from the average of the two feed nodes. </div>' +
        '</div>'
    },
    'desc-15': {
      question: 'What\'s the feeding nodes in Oracel?',
      answer: '<div>' +
        '<div>Feeding nodes for NEO and GAS: Bibox, Binance, Bitfinex, EXX, Bittrex, Huobi, OKEX, Gate, HitBTC and ZB</div>' +
        '<div>Feeding node of SDS: Bilaxy and Coinmex</div>' +
        '</div>',
    },
    'desc-16': {
      question: 'Where can I use SDUSD?',
      answer: '<div>SDUSD can be used in these scenario:' +
        '<ol>' +
        '<li>Participate Liquidation on Alchemint Platform;</li>' +
        '<li>Use as base currency to trade on Switcheo (https://switcheo.exchange)</li>' +
        '</ol></div>',
    },
    'desc-17': {
      question: 'How can I get more help?',
      answer: 'If you need more help, feel free to email Service@alchemint.io.',
    },
    'desc-18': {
      question: 'How does Alchemint keep SDUSD pegged to the U.S. Dollar?',
      answer: 'Maintaining the stability of SDUSD is achieved through a number of mechanisms such as over-collateralization, clearing incentives, opportunistic participation, and risk control parameter adjustment. Under this mechanism, market participants have the incentive to correct the price of SDUSD through the mortgage and issue, liquidation, purchase and sell-off when the SDUSD is un-anchored, and get the proceeds from it.',
    },
    'desc-19': {
      question: 'How can a person use O3’s Alchemint App to mortgage NEO and receive the Stablecoin SDUSD?',
      answer: 'At present, O3 wallet only supports“One-click mint” function. If you need to return SDUSD, please use web browser to performance the action.\n' +
        'For more details about “One-click mint”, please refer the next question.',
    },
    'desc-20': {
      question: 'How to use One-Click issue function?',
      answer: '<div>To use One-Click issue function, you only need to select X amount of SDUSD you want to generate and Y amount of NEO you want to mortgage. You can issue SDUSD.' +
        '<div>After clicking on a piece of currency, the system will do the following in the background:</div>' +
        '<ol>' +
        '<li>Turn on SAR</li>' +
        '<li>Converting Y amount of NEO to SNEO</li>' +
        '<li>Deposit Y amount of SNEO into the SAR</li>' +
        '<li>Generate X amount of SDUSD</li>' +
        '</ol></div>',
    },
    'desc-21': {
      question: 'What is the difference between SDS and SDUSD?',
      answer: '<div>SDS: it refers to Alchemint platform token. It acts as a mean to pay for collateral service fee. The price of SDS will fluctuate like other cryptocurrencies.</div>' +
        '<div>SDUSD: it is pegged to 1 USD. The price of SDUSD will not fluctuate much.</div>',
    },
    'desc-22': {
      question: 'What\'s is the ceiling? What\'s will happend when it reaches the ceiling?',
      answer: 'The SDUSD Overall Issuing Ceiling is set by Alchemint Foundation, the number is based by the Alchemint platform development and NEO’s market value. When SDUSD reach the ceiling, user can not issue SDUSD unless someone returns some SDUSD first. Alchemint foundation will increase the overall issuing ceiling based on SDUSD issuing situation.',
    },
    'desc-23': {
      question: 'What are the differences between SAR-B and SAR-C?',
      answer: '<div>SAR-B: Stablecoin is issued through the means of the 100% off-chain currency reserves and on-chain SDS locked as a security deposit by smart contract. Each SAR will lock SDS. The market value and the minimum margin ratio of SDS determine the number of stablecoin that can be released. The current minimum deposit ratio of 50%. </div>' +
        '<div>SAR-C: Mainly for individual users and business users. Stablecoin is issued by over-collateralizing digital assets. The stablecoin name is SDUSD. SDUSD is NEP-5 asset can be transfer via NEO wallet.</div>',
    },
    'desc-24': {
      question: 'How does Alchemint keep SDUSD safe?',
      answer: 'SDUSD has at least 150% NEO asset reserves behind it, which means that each SDUSD has at least $1.50 NEO as a collateral asset. If the NEO price declines which reduces the mortgage asset value behind the SDUSD to less than 1.5 times,  the opportunist has the right to purchase part of the NEO in the SAR at 90% of the market price and replace the SAR creator to return part of the debt. In this way the asset mortgage rate of SDUSD has remained above 1.5 times.',
    },*/
  }
}
