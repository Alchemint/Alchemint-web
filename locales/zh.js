export default {
  nav: {
    individual: '个人',
    institution: '机构',
    wallet: '钱包',
    tools: '工具',
    lock: '锁仓',
    account: '账户',
    logout: '注销',
    help: '帮助',
    termsService: '服务条款',
    userManual: '操作手册',
    video: '视频演示',
    contact: '联系我们',
    //maintenanceState: '系统当前处于维护状态，暂不建议使用。预计于新加坡时间 X月X日 15：00 前恢复正常。',
    maintenanceState: '系统当前处于维护状态，暂不建议使用。',
  },
  login: {
    json: '导入Keystore',
    pwd: '密码',
    wif: '请输入您的私钥',
    loginByKey: '私钥登录',
    loginByJson: 'KeyStore登录',
    loginByCold: '硬钱包登录',
    coldWalletInfo: '<li>请连接你的硬件钱包</li>' +
      '<li>并打开NEO App</li>',
    jsonErr: 'KeyStore或密码不正确',
    wifErr: '私钥不正确，请重新输入'
  },
  register: {
    wallet: '钱包名',
    pwd: '密码',
    confirmPwd: '确认密码',
    walletErr: '请输入不超过20位的字母、数字或符号',
    pwdErr: '请输入不超过20位的字母、数字或符号',
    confirmPwdErr: '两次密码不一致',
    succTitle: '您的Keystore文件已生成<br>请务必下载并保管好您的Keystore文件',
    succInfo: ' <li>Keystore一旦丢失，本平台无法帮助找回。</li>\n' +
      '          <li>登录时可使用Keystore+密码登陆您的账户，也可通过导入密钥的方式登陆。</li>',
    downLoadBtn: '下载Keystore',
  },
  lock: {
    title: '锁仓',
    openTit: '开通锁仓账户',
    openBtn: '开通锁仓账户',
    benefitAddrTit: '多链收益地址',
    benefitAddr: '收益地址',
    addAddrBtn: '添加',
    editBtn: '修改',
    inputPhl: '请输入',
    basic: {
      title: '基本情况',
      type: "类型",
      additionalBenefits: '额外收益',
      benefit: '收益',
      status: '状态',
      operation: '操作',
      deposit: '充值',
      draw: '提取',
      lockNum: '锁仓数量',
      remainTime: '剩余时间',
      withDrawSds:'提取SDS',
      withDrawSdsInfo:'您将提取本期全部锁仓的SDS至您的钱包。',
      depositLock: 'SDS锁仓充值',
      depositLockNum: '锁仓充值数量',
      depositInfoTit:'提示',
      depositInfo: '本期锁仓一旦确定，中途不可更改,直到锁仓倒计时结束方可提取和进行下次锁仓充值。',
    },
    history: {
      title: '历史记录',
      assetAddr: '资产地址',
      type: '类型',
      lockType: '锁仓类型',
      quantity: '数量',
      lockTime: '操作时间',
      TX: 'TX',
    }
  },
  wallet: {
    asset: '资产',
    transfer: '转账',
    walletInfo: '钱包信息',
    myAddr: '我的钱包地址',
    myWif: '我的私钥',
    assetBalance: '资产余额',
    currency: '币种',
    balance: '数量',
    unitPrice: '单价',
    totalValue: '总价值',
    transferInfo: '本钱包支持所有包括Nep-5在内的NEO公链上的资产；暂不支持非NEO链上资产，请勿转入BTC和ETH等。 ',
    transferAsset: '资产',
    toAddress: '转账地址',
    toAddressPhl: '请输入接收地址',
    amount: '数量',
    amountPhl: '请输入转账数量',
    transferHistory: '转账记录',
    from: '来自',
    to: '发往',
    bSystemInfo: 'SAR-B 智能合约操作',
    cSystemInfo: 'SAR-C 智能合约操作',
    errAddr: '信息有误',
    category: {
      sarB: 'B端稳定币',
      global: '全局资产',
      tranType: '交易类型',
    },
    liquidate: {
      title: '清算',
      sar: '是否将',
      sds: '转化为',
      info: '已转入您的账户中，请查收'
    },
    transferModal: {
      title: '确认转账',
      amount: '你将把',
      to: '发往',
      fee: '手续费',
    },
  },
  individual: {
    statusInfo: '<li>当0&lt;SAR抵押率&lt;{lineRate}%时，SAR状态栏显示为"危急"；</li>' +
      '<li>当{lineRate}%&lt;=SAR抵押率&lt;{topRate}%时，SAR状态显示为"不安全"；</li>' +
      '<li>当SAR抵押率&gt;={topRate}%时，SAR状态显示为"安全"。</li>',
    relevantAssets: {
      title: '相关资产',
      type: '币种',
      quantity: '数量',
      price: '实时价格',
      value: '总额',
    },
    neoToSneo: {
      amountToInput: '选择转化数量',
      amountToGet: '转化后数量',
      info: '<li>由于NEO最小单位为1，不可无限分割，故平台采用SNEO作为抵押物，其最小分割单位为0.00000001。SNEO与NEO兑换比例恒定为1:1。</li>' +
        '<li>任何时候，用户可在阿基米德平台自由兑换SNEO和NEO，但兑换额度必须为整数，不允许键入小数点。</li>' +
        '<li>若由于不当操作（区块确认过程中手动刷新或网页关闭），导致转化失败，且SNEO或NEO数量变少，请通过屏幕下方邮件联系我们。</li>',
      warnTitle: '注意',
      warnInfo: '<li>请务必不要关闭，或者手动刷新本页面！</li>' +
        '<li>否则可能会导致转换失败和数量错误！</li>' +
        '<li>请耐心等待右上角的2个30s倒计时结束。</li>',
      transferAgain: '转化不成功，请点击',
      transferAgainBtn: '继续转化',
      transferAgainTitle: '继续执行转化SNEO->NEO',
      continueBtn: '执行',
      warnTip: '由于SNEO转NEO时需要2个连续的区块确认交易，故转化过程中若发生页面刷新或关闭等情况，会导致交易中断和数量显示问题。如发生该情况，请点击【继续转化】，继续执行原本被中断的转化任务，待区块确认后数量即可恢复正常。'
    },
    systemStatus: {
      title: '系统状态',
      sneoTotal: 'SNEO抵押总量',
      sdusdTotal: 'SDUSD发行总量',
      allRate: '全局抵押率',
      liquidateRate: '清算触发抵押率',
      liquidateDis: '清算折扣',
      issuingRate: '年费率',
      deptTop: 'SDUSD全局发行上限',
      feePaid: '全局已缴手续费 (SDS)',
      predictFeeTotal: "全局待缴费手续费(SDS)"
    },
    sarCList: {
      title: '全局SAR-C列表',
      sdusdIssued: 'SDUSD已发行额',
      sdusdRemained: 'SDUSD可发余额',
      sneoCollateralized: 'SNEO已抵押额',
      sneoDrawable: 'SNEO可提取额',
      mortageRate: 'SAR抵押率',
      liquidationPrice: '清算触发价(SNEO)',
      status: 'SAR状态',
      history: '历史',
      liquidate: '清算',
      all: '全部',
      filter: '筛选',
    },
    mySar: {
      title: '我的SAR',
      createSar: '创建SAR',
      sdusdRemained: 'SDUSD可发行',
      sneoDrawable: 'SNEO可提取',
      sarRate: 'SAR抵押率',
      feeBalance: 'SDS余额',
      status: 'SAR状态',
      sdusdIssued: 'SDUSD已发行',
      sneoCollateralized: 'SNEO已抵押',
      liquidationPrice: '清算触发价(SNEO)',
      feeGenerated: '待缴手续费（SDS）',
      fee: '手续费',
      insufficientFee: 'SDS余额不足，请充值SDS后再回收稳定币',
      increase: '抵押SNEO',
      draw: '提取SNEO',
      issue: '发行SDUSD',
      return: '归还SDUSD',
      recharge: '充值SDS',
      refund: '提取SDS',
      history: '操作历史',
      closeSar: '关闭SAR',
      closeSarSure: '是否确定关闭？',
      closeSarInfo: '关闭后历史记录会消失，您将无法再查看。',
      rechargeInfo: '回收稳定币时需要以SDS形式支付手续费，请确保您的SAR中有足够的SDS。',
      afterMortgageRate: '抵押率',
      afterStatus: '状态',
      liquidationRiskInfo: '若抵押率低于{topRate}%，被清算风险较大。',
      riskModal: {
        title: '风险告知',
        infoTitle: '若抵押率低于{topRate}%，被清算风险较大。',
        infoDetail: '<li>若NEO价格下跌15%，您的SAR抵押率会有22.5%-30%的下降。</li>' +
          '<li style="margin-top: 10px">若抵押率跌破{lineRate}%，您的SAR可被他人清算，同时系统会根据清算数额和清算折扣自动扣除一定数量的罚金。</li>',
        cancelBtn: '我再想想',
        confirmBtn: '我明白风险，继续执行',
      },
      quickSarModal: {
        title: '一键发币',
        collateralizeNeo: '抵押NEO',
        issueSdusd: '发行SDUSD',
      },
      quickSarInfo: '<li>本功能可自动执行多个步骤（NEO->SDUSD）。</li>' +
        '<li>执行过程若关闭或手动刷新页面，将导致自动化过程中断，但资产不受影响，您可手动继续执行未完成的步骤。</li>'
    },
    myBond: {
      title: '我的BOND',
      bondUsed: 'BOND已用额',
      sneoLocked: 'SNEO锁定额',
      liquidate: '用BOND清算',
      payBack: '偿还BOND',
      history: '操作历史',
      historyTitle: 'BOND操作历史'
    },
    liquidateModal: {
      title: '清算',
      sdusdAmount: '投入SDUSD数量',
      bondAmount: '投入BOND数量',
      sneoAmount: '获得SNEO数量',
      value: '总值',
      afterLiq: '清算后的抵押率',
      afterStatus: '清算后的状态',
      info: '<li>当单个SAR抵押率低于{lineRate}%时，系统显示"清算"按钮。</li>' +
        '<li>您可使用SDUSD参与清算其中一部分抵押物。</li>' +
        '<li>若单次清算使得抵押率回升至{lineRate}%-{topRate}%，则不可继续清算。</li>'
    }
  },
  institution: {
    relevantAssets: '相关资产',
    stableCoinsMarket: '稳定币市场',
    currency: '币种',
    circulation: '发行量',
    type: '类型',
    peg: '锚定物',
    margin: '保证金',
    sdsMargin: 'SDS保证金',
    marginRate: '保证金率',
    status: '状态',
    operation: '操作',
    assetPrice: '资产价格',
    name: '名称',
    lastestPrice: '最新价',
    mySar: '我的SAR',
    createSar: '创建SAR',
    issue: '发行稳定币',
    reture: '回收稳定币',
    startSar: '启动SAR',
    closeSar: '关闭SAR',
    increaseMargin: '增加保证金',
    drawMargin: '回收保证金',
    history: '历史记录',
    createCoin: {
      modalTitle: '给稳定币命名',
      name: '名称',
      namePhl: '请输入名称后缀,限3-5个大写字母',
      nameErr: '名称已被占用',
      type: '锚定资产类型',
      typePhl: '请选择锚定资产类型',
    },
    launchCoin: {
      modalTitle: '启动SAR',
      info: '<li>正式启用SAR需缴纳10个SDS作为启动押金。</li>\n' +
        '    <li>启动押金也记为抵押物的一部分。</li>\n' +
        '    <li>在您关闭SAR时，启动押金会自动退还至您的账户。</li>'
    },
    issuePhl: '请输入发行稳定币的数量',
    returePhl: '请输入回收稳定币的数量',
    increaseMarginPhl: '请输入增加保证金的数量',
    drawMarginPhl: '请输入回收保证金的数量',
    drawMarginInfo: '<li>保证金中有10个SDS为启动押金，不可直接提取。</li>\n' +
      '        <li>在您关闭SAR时，启动押金会自动退还至您的账户。</li>',
    closeSarInfo: '<li>关闭后历史记录会消失，您将无法再查看。</li>\n' +
      '        <li>该SAR币名称将再次处于可用状态。</li>\n' +
      '        <li>启动押金会自动退还至您的账户。</li>\n' +
      '        <li>关闭SAR前确保：发行量为0，且保证金数量恰好为10。</li>'
  },
  global: {
    loading: '加载中',
    loginBtn: '登录',
    loginBtn1: '登录',
    registerBtn: '注册',
    otherwise: '或者',
    copy: '复制',
    display: '显示',
    hide: '隐藏',
    liquidate: '清算',
    confirmBtn: '确认',
    cancelBtn: '取消',
    all: '全部',
    perPageNum: '单页显示',
    row: '行',
    noData: '空空如也',
    copySucc: '复制成功',
    copyErr: '复制失败',
    history: {
      sarOperationHistory: 'SAR操作历史',
      liquidatioOperationHistory: '清算操作历史',
      date: '日期',
      operation: '操作',
      quantity: '数量',
      tx: 'TX',
    },
    fee:'手续费',
    feeInfo:'优先处理此笔交易 （ 支付0.001 GAS ）',
  },
  tools: {
    contractAddr: {
      title: '合约地址',
      blockHeight: '区块高度',
      sdusdAddr: 'SDUSD地址',
      sar4CAddr: 'SAR4C地址',
      oracleAddr: 'Oracle地址',
      sdsAddr: 'SDS地址',
      sar4BAddr: 'SAR4B地址',
      tokenAddr: 'Tokenized Asset地址',
    },
    browse: {
      title: '浏览器',
      search: '搜索',
      searchPhl: '请输入您想查询的地址/交易ID',
      assetInfo: '资产信息',
      transactionInfo: '交易信息',
      txid: '交易ID',
      type: '类型',
      netFee: '网络费用',
      sysFee: '系统费用',
      size: '大小',
      height: '区块高度',
      time: '时间',
      input: '输入',
      address: '地址',
      asset: '资产',
      output: '输出',
      from: '转出',
      to: '转入',
      value: '金额',
    }
  },
  envs: [
    {
      name: "neo",
      label: '主网'
    },
    {
      name: "testNet",
      label: '测试网'
    },
    {
      name: "pri",
      label: '私链'
    }
  ],
  anchorTypes: [
    {
      value: 'anchor_type_usd',
      label: '美元'
    },
    {
      value: 'anchor_type_eur',
      label: '欧元'
    },
    {
      value: 'anchor_type_jpy',
      label: '日元'
    },
    {
      value: 'anchor_type_gbp',
      label: '英镑'
    },
    {
      value: 'anchor_type_gold',
      label: '黄金'
    },
  ],
  sarCStatus: [
    {
      value: '0',
      label: '--'
    },
    {
      value: '1',
      label: '安全'
    },
    {
      value: '2',
      label: '不安全'
    },
    {
      value: '3',
      label: '危急'
    }
  ],
  sarBStatus: [
    {
      value: 1,
      label: '安全'
    },
    {
      value: 2,
      label: '不可用'
    },
    {
      value: 3,
      label: '锁定'
    }
  ],
  sarBTypes: [
    {
      value: 1,
      label: '创建SAR'
    },
    {
      value: 2,
      label: '启动SAR'
    },
    {
      value: 3,
      label: '增加保证金'
    },
    {
      value: 4,
      label: '发行稳定币'
    },
    {
      value: 5,
      label: '提取保证金'
    },
    {
      value: 6,
      label: '回收稳定币'
    },
    {
      value: 7,
      label: '关闭SAR'
    },
    {
      value: 8,
      label: '清算'
    },
    {
      value: 9,
      label: '销毁'
    }
  ],
  sarCTypes: [
    {
      value: 1,
      label: '创建SAR'
    },
    {
      value: 2,
      label: '抵押SNEO'
    },
    {
      value: 3,
      label: '发行SDUSD'
    },
    {
      value: 4,
      label: '提取SNEO'
    },
    {
      value: 5,
      label: '归还SDUSD'
    },
    {
      value: 6,
      label: '关闭SAR'
    },
    {
      value: 7,
      label: '被清算'
    },
    {
      value: 8,
      label: '转移所有权'
    },
    {
      value: 9,
      label: 'BOND清算'
    },
    {
      value: 10,
      label: '偿还BOND'
    },
    {
      value: 11,
      label: '充值SDS'
    },
    {
      value: 12,
      label: '签收清算资产'
    },
    {
      value: 13,
      label: '提取SDS'
    },
  ],
  faq: {
    title: '常见问题',
    search: '搜索',
    /*'desc-1': {
      question: '发币流程是什么？',
      answer: '<div>你将至少需要持有1个或以上的NEO才能使用平台发行稳定币。</div>\n' +
        '<div>发币流程为：</div>' +
        '<ol style="margin: 0">' +
        '<li>将NEO转换为SNEO</li>' +
        '<li>抵押SNEO</li>' +
        '<li>发行SDUSD</li>' +
        '</ol>'
    },
    'desc-2': {
      question: '抵押率是什么？',
      answer: '抵押率 = SAR中抵押的SNEO价值 / 所发行的SDUSD价值',
    },
    'desc-3': {
      question: '各种SAR状态代表什么？',
      answer: '<ul>' +
        '<li>当 0<150%时，SAR 状态栏显示为“紧急”；在“紧急”状态中，他人可以参与“清算”（爆仓），并使该SAR抵押率回到150%以上。</li>' +
        '<li>当 150%<=SAR 抵押率<200%时，SAR 状态显示为“不安全”；在“不安全”状态中，他人无法“清算”该SAR。但我们建议用户在“不安全”状态时抵押更多的SNEO或者归还SDUSD，以提高抵押率，降低由于NEO下跌导致的被他人爆仓的风险。</li>' +
        '<li>当 SAR 抵押率>=200%时，SAR 状态显示为“安全”，被爆仓风险相对较低。</li>' +
        '</ul>'
    },
    'desc-4': {
      question: '还币流程是什么？',
      answer: '<div>归还流程为：' +
        '<ol>' +
        '<li>充值SDS </li>' +
        '<li>归还SDUSD并选择归还数量</li>' +
        '<li>提取抵押物SNEO</li>' +
        '<li>将SNEO转化为NEO</li>' +
        '</ol>' +
        '</div>',
    },
    'desc-5': {
      question: '我的SAR抵押率过低时，该怎么办？',
      answer: '<div>当抵押率较低时，可以选择下面其中一种方式来提高你的抵押率：<ol>' +
        '<li>添加抵押物SNEO</li>' +
        '<li>归还SDUSD</li>' +
        '</ol></div>',
    },
    'desc-6': {
      question: '他人的SAR抵押率低于150%时，我能干什么，对我有什么好处？',
      answer: '当他人的SAR低于150%抵押率时，你可以参与清算。任何持有 SDUSD 并开通SAR的用户均可参与清算，并以较低的折扣获得相应的抵押资产。最高可将抵押率清算到160%。但当清算后，抵押率回升到 150%及以上时，则不再继续允许对该 SAR 进行清算。\n' +
        '清算所获得的NEO的价格比市场价低10%。',
    },
    'desc-7': {
      question: '建议抵押率是多少？',
      answer: '建议抵押率高于200%，越高越好。',
    },
    'desc-8': {
      question: 'SNEO是什么？',
      answer: 'SNEO 是由 NGD（NEO Global Development）发布的符合 NEP-5 规范的合约资产，SNEO 可由 NEO 一比一地对换，并且支持退回操作。该合约的目的是将 NEO 进行全局资产的合约映射，使全局资产 NEO 可以方便地在合约内部流转，支持由合约调用转账，而且本合约已经提供提取GAS的功能。'
    },
    'desc-9': {
      question: '稳定币发行费率是什么？',
      answer: '发行费率是根据所发行的SDUSD数量来计算的，将以SDS形式支付',
    },
    'desc-10': {
      question: '如何计费？',
      answer: '归还SDUSD时，所需缴纳的SDS费率计算公式为:（当前区块高度 - 借出SDUSD的区块高度）* 归还数额 * 费率 / SDS市价',
    },
    'desc-11': {
      question: '目前费率是多少？',
      answer: '目前平台稳定币费率为2%'
    },
    'desc-12': {
      question: '抵押着的NEO会分发GAS么？',
      answer: '会',
    },
    'desc-13': {
      question: 'GAS的分发机制是什么？',
      answer: '一般情况下，针对钱包内的NEO所产生的GAS，每月初分发一次。针对SNEO产生的GAS暂时不会分发，SNEO转化为NEO后的下一个月初，系统会把所累计的GAS一次性分发给用户。',
    },
    'desc-14': {
      question: '如何获取NEO&SDS市场价的？',
      answer: '<ul>' +
        '<li>目前已选取10个NEO喂价节点，系统将进行实时排序，并取得中位数作为系统喂价。系统每6分钟按顺序更新其中一个节点的价格。</li>' +
        '<li>SDS的价格则取自于2个喂价节点的平均数。</li>' +
        '</ul>'
    },
    'desc-15': {
      question: 'Oracle喂价器的喂价节点有哪些？',
      answer: '<div>' +
        '<div>NEO和GAS的喂价节点：Bibox, Binance, Bitfinex, EXX, Bittrex, Huobi, OKEX, Gate, HitBTC 和ZB</div>' +
        '<div>SDS的喂价节点：Bilaxy 和 Coinmex</div>' +
        '</div>',
    },
    'desc-16': {
      question: 'SDUSD可以在哪里使用？',
      answer: '<div>DUSD目前可以在以下场景使用：' +
        '<ol>' +
        '<li>使用SDUSD参与清算</li>' +
        '<li>在Switcheo（https://switcheo.exchange）以及CoinMex（https://coinmex.com）进行交易 </li>' +
        '</ol></div>',
    },
    'desc-17': {
      question: '如何获取更多帮助？',
      answer: '如需帮助，请邮件至service@alchemint.io询问.',
    },
    'desc-18': {
      question: 'SDUSD如何保持稳定，机制是什么?',
      answer: '保持SDUSD的稳定是通过超额抵押、清算奖励、伺机者参与、风控参数调节等一些列机制来实现的。在该机制下，市场参与者有动力在SDUSD脱锚时通过抵押发行、清算、购买和抛售等一些列行为，对SDUSD的价格进行修正，并从中获得收益。',
    },
    'desc-19': {
      question: '如何使用O3钱包发行SDUSD？',
      answer: 'O3钱包目前仅支持一键发币，尚不支持在O3钱包内归还SDUSD。请参考“如何使用一键发币功能？”获取更多信息',
    },
    'desc-20': {
      question: '如何使用一键发币功能？',
      answer: '<div>使用一键发币，只需要选择你想生成X数量的SDUSD以及你想抵押Y数量的NEO，即可发行SDUSD。' +
        '<div>点击一件发币后，系统将在后台进行如下操作：</div>' +
        '<ol>' +
        '<li>开启SAR</li>' +
        '<li>转换Y数量的NEO成为SNEO</li>' +
        '<li>存入Y数量的SNEO进入SAR</li>' +
        '<li>产生X数量的SDUSD</li>' +
        '</ol></div>',
    },
    'desc-21': {
      question: 'SDS和SDUSD的区别是什么？',
      answer: '<div>SDS：阿基米德项目的平台通证。在 SAR-C 中，充当稳定币回收时所需抵扣的手 续费。SDS价格与大多数数字货币一样，会有大幅波动。</div>' +
        '<div>SDUSD是价格锚定1美元的稳定币，其价格不会剧烈波动。</div>',
    },
    'desc-22': {
      question: 'SDUSD全局发行上限是什么？如果到达上限会发生什么？',
      answer: 'SDUSD全局发行上限是阿基米德基金会依照目前平台发展情况以及NEO市值规模所设置的。当SDUSD的发行量到达SDUSD全局发行上限时，用户将无法发行SDUSD，直至有用户归还SDUSD。\n' +
        '阿基米德基金会将依照情况逐步提高SDUSD全局发行上限。',
    },
    'desc-23': {
      question: 'SAR-B和SAR-C的区别是什么？',
      answer: '<div>SAR-B：主要面向商业机构用户，机构通过链下的 100%法币储备以及链上的通 过智能合约锁定的 SDS 作为保证金来发行稳定币。每个 SAR 会锁定 SDS，并根 据锁定 SDS 的市值以及设置的最低保证金比例决定机构可以发行的稳定币数量。目前最低保证金比例为 50%。SAR-B创建者可以自行定义该币的缩写。</div>' +
        '<div>SAR-C：主要面向个人用户和商业机构，通过超额抵押数字资产的方式发行稳定币，稳定币名字为 SDUSD。SDUSD是标准的NEP-5代币。</div>',
    },
    'desc-24': {
      question: 'SDUSD是否安全？',
      answer: 'SDUSD的背后拥有至少150%的NEO资产储备，也就是说每一个SDUSD的背后都有至少价值1.5美元的NEO作为抵押资产。如果NEO价格下降使得SDUSD背后的抵押资产减少至低于1.5倍，此时伺机者有权利以90%的市场价格购买SAR中的部分NEO并替SAR的创建者归还其部分债务，通过此方式使得SDUSD的资产抵押率始终保持在1.5倍以上。',
    },*/
  }
}
