export default {
  nav: {
    individual: '个人',
    institution: '机构',
    wallet: '钱包',
    tools: '工具',
    account: '账户',
    logout: '注销',
    help: '帮助',
    userManual: '操作手册',
    termsService: '服务条款',
  },
  login: {
    json: '导入Keystore',
    pwd: '密码',
    wif: '请输入您的私钥',
    loginByKey: '通过私钥登录',
    loginByJson: '通过Keystore登录',
    jsonErr: 'Keystore或密码不正确',
    wifErr: '私钥不正确，请重新输入'
  },
  register: {
    wallet: '钱包名',
    pwd: '密码',
    confirmPwd: '确认密码',
    walletErr: '请输入1-20位密码',
    pwdErr: '请输入1-20位密码',
    confirmPwdErr: '两次密码不一致',
    succTitle: '您的Keystore文件已生成<br>请务必下载并保管好您的Keystore文件',
    succInfo: ' <li>Keystore一旦丢失，本平台无法帮助找回。</li>\n' +
      '          <li>登录时可使用Keystore+密码登陆您的账户，也可通过导入密钥的方式登陆。</li>',
    downLoadBtn: '下载Keystore',
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
    from: '发往',
    to: '来自',
    bSystemInfo: 'SAR-B 智能合约操作',
    cSystemInfo: 'SAR-C 智能合约操作',
    errAddr: '地址有误',
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
    }
  },
  individual: {
    statusInfo: '<li>当0&lt;SAR抵押率&lt;150%时，SAR状态栏显示为"危急"；</li>' +
      '<li>当150%&lt;=SAR抵押率&lt;=200%时，SAR状态显示为"不安全"；</li>' +
      '<li>当SAR抵押率&gt;200%时，SAR状态显示为"安全"。</li>',
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
        '<li>任何时候，用户可在阿基米德平台自由兑换SNEO和NEO，但兑换额度必须为整数，不允许键入小数点。</li>',
      warnTitle: '注意',
      warnInfo: '<li>请务必不要关闭，或者手动刷新本页面！</li>' +
        '<li>否则可能会导致转换失败和数量错误！</li>' +
        '<li>请耐心等待右上角侧2个30s倒计时结束。</li>'
    },
    systemStatus: {
      title: '系统状态',
      sneoTotal: 'SNEO抵押总量',
      sdusdTotal: 'SDUSD发行总量',
      allRate: '全局抵押率',
      liquidateRate: '清算抵押率',
      liquidateDis: '清算价格折扣率',
      issuingRate: '年发行费用',
      deptTop: 'SDUSD全局发行上限',
    },
    sarCList: {
      title: '全局SAR-C列表',
      sdusdIssued: 'SDUSD已发行额',
      sdusdRemained: 'SDUSD可发余额',
      sneoCollateralized: 'SNEO已抵押额',
      sneoDrawable: 'SNEO可提取额',
      mortageRate: 'SAR抵押率',
      liquidationPrice: 'SAR清算价格(SNEO)',
      status: 'SAR状态',
      history: '历史',
      liquidate: '清算'
    },
    mySar: {
      title: '我的SAR',
      createSar: '创建SAR',
      sdusdRemained: 'SDUSD可发行',
      sneoDrawable: 'SNEO可提取',
      sarRate: 'SAR抵押率',
      feeBalance: '手续费余额(SDS)',
      status: 'SAR状态',
      sdusdIssued: 'SDUSD已发行',
      sneoCollateralized: 'SNEO已抵押',
      liquidationPrice: 'SAR清算价格(SNEO)',
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
      info: '<li>当单个SAR抵押率低于150%时，系统显示"清算"按钮。</li>' +
        '<li>您可使用SDUSD参与清算其中一部分抵押物。</li>' +
        '<li>若单次清算使得抵押率回升至150%-160%，则不可继续清算。</li>'
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
    }
  },
  envs: [
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
      label: '增加抵押物'
    },
    {
      value: 3,
      label: '发行稳定币'
    },
    {
      value: 4,
      label: '提取抵押物'
    },
    {
      value: 5,
      label: '回收稳定币'
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
      label: '充值手续费'
    },
    {
      value: 12,
      label: '签收清算资产'
    },
    {
      value: 13,
      label: '提取手续费'
    },
  ],
}
