export default {
  nav: {
    individual: 'Individual',
    institution: 'Institution',
    wallet: 'Wallet',
    tools: 'Tools',
    account: 'Account',
    logout: 'Log Out',
    help: 'Help',
    termsService: 'Terms of Service',
    userManual: 'User Manual',
    video: 'Video Tutorial',
    contact: 'Contact Us'
  },
  login: {
    json: 'Import Keystore',
    pwd: 'Password',
    wif: 'Please input your private key',
    loginByKey: 'Log in by private key',
    loginByJson: 'Log in by Keystore File',
    jsonErr: 'Keystore or password incorret',
    wifErr: 'Key is incorret, try again'
  },
  register: {
    wallet: 'Wallet name',
    pwd: 'Password',
    confirmPwd: 'Confirm password',
    walletErr: 'Please input 1-20 characters',
    pwdErr: 'Please input 1-20 characters',
    confirmPwdErr: 'Password do not match',
    succTitle: 'Your Keystore file has been generated. Be sure to download and keep your Keystore file!',
    succInfo: '<li>Once the Keystore file is lost, it cannot be recovered by the platform.</li>\n' +
      '          <li>You can log in by Keystore file + password or merely by the private key.</li>',
    downLoadBtn: 'Download Keystore File',
  },
  wallet: {
    asset: 'Assets',
    transfer: 'Transfer',
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
      fee: 'Service fee',
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
      transferAgain: 'Conversion failed. Please click Reconvert',
      transferAgainBtn: 'Reconvert'
    },
    systemStatus: {
      title: 'System Status',
      sneoTotal: 'Total SNEO Collateralized',
      sdusdTotal: 'Total SDUSD Issued',
      allRate: 'Overall Mortgage Rate',
      liquidateRate: 'Liquidation Trigger Rate',
      liquidateDis: 'Liquidation Discount',
      issuingRate: 'Issuing Fee (Yearly)',
      deptTop: 'Overall Issueing Ceiling (SDUSD)',
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
      liquidate: 'Liquidate'
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
      }
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
    }
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
}
