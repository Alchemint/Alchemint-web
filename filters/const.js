//全局loading的样式
export const LOADING_OPTION = {
  lock: false,
  text: '',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.5)'
};

export const EIGHT_POWER = Math.pow(10, 8);
export const SIX_POWER = Math.pow(10, 6);
export const SIXTEEN_POWER = Math.pow(10, 16);

export const types = [
  {
    zhName: "30天锁仓期",
    enName: "30-day Staking Period",
    key: "lock_01"
  },
  {
    zhName: "90天锁仓期",
    enName: "90-day Staking Period",
    key: "lock_02"
  },
  {
    zhName: "180天锁仓期",
    enName: "180-day Staking Period",
    key: "lock_03"
  },
  {
    zhName: "360天锁仓期",
    enName: "360-day Staking Period",
    key: "lock_04"
  }
];

export const lockConfigTypes = [
  {
    zhName: "开通锁仓账户",
    enName: "Open",
    key: 1
  },
  {
    zhName: "锁仓",
    enName: "Lock",
    key: 2
  },
  {
    zhName: "提取",
    enName: "Withdraw",
    key: 3
  },
  {
    zhName: "关闭",
    enName: "Shut",
    key: 4
  },
];

export const faqDetails = [
  {
    zhQue: '发币流程是什么？',
    zhAns: '<div>你将至少需要持有1个或以上的NEO才能使用平台发行稳定币。</div>\n' +
      '<div>发币流程为：</div>' +
      '<ol style="margin: 0">' +
      '<li>将NEO转换为SNEO</li>' +
      '<li>抵押SNEO</li>' +
      '<li>发行SDUSD</li>' +
      '</ol>',
    enQue: 'What\'s the process for issuing stablecoin SDUSD?',
    enAns: '<div>You will need AT LEAST 1 NEO or more to use Alchemint stablecoin issuance platform to issue stablecoin SDUSD.</div>\n' +
      '<div>The process of issuing SDUSD are:</div>' +
      '<ol style="margin: 0">' +
      '<li>Convert NEO into SNEO</li>' +
      '<li>Deposite SNEO into SAR</li>' +
      '<li>Issue SDUSD</li>' +
      '</ol>'
  },
  {
    zhQue: '抵押率是什么？',
    zhAns: '抵押率 = SAR中抵押的SNEO价值 / 所发行的SDUSD价值',
    enQue: 'What\'s Mortgage rate?',
    enAns: 'Mortgage Rate = Value of SNEO Collateralized / Value of SDUSD Issued',
  },
  {
    zhQue: '各种SAR状态代表什么？',
    zhAns: '<ul>' +
      '<li>当 0<150%时，SAR 状态栏显示为“紧急”；在“紧急”状态中，他人可以参与“清算”（爆仓），并使该SAR抵押率回到150%以上。</li>' +
      '<li>当 150%<=SAR 抵押率<200%时，SAR 状态显示为“不安全”；在“不安全”状态中，他人无法“清算”该SAR。但我们建议用户在“不安全”状态时抵押更多的SNEO或者归还SDUSD，以提高抵押率，降低由于NEO下跌导致的被他人爆仓的风险。</li>' +
      '<li>当 SAR 抵押率>=200%时，SAR 状态显示为“安全”，被爆仓风险相对较低。</li>' +
      '</ul>',
    enQue: 'What\'s different SAR status mean?',
    enAns: '<ul>' +
      '<li>Critical: when mortgage rate < 150%, SAR creator needs to add more collateral or return SDUSD to increase the mortgage rate as soon as possible, otherwise others can liquidate this SAR to “help” increasing the mortgage rate.</li>' +
      '<li>Unsafe: when150%< mortgage rate <200%, SAR creator is highly suggested to add more collateral or return SDUSD to increase the mortgage rate in order to avoid the SAR becoming Critical status.However, in this status, others can’t liquid this SAR.</li>' +
      '<li>Safe: when mortgage rate >=200%, status is displayed as "Safe ".The risk of being liquidated is relatively low.</li>' +
      '</ul>'
  },
  {
    zhQue: '还币流程是什么？',
    zhAns: '<div>归还流程为：' +
      '<ol>' +
      '<li>充值SDS </li>' +
      '<li>归还SDUSD并选择归还数量</li>' +
      '<li>提取抵押物SNEO</li>' +
      '<li>将SNEO转化为NEO</li>' +
      '</ol>' +
      '</div>',
    enQue: 'What\'s the process for returing stablecoin SDUSD?',
    enAns: '<div>The process of returning SDUSD are:' +
      '<ol>' +
      '<li>Deposit SDS</li>' +
      '<li>Click \'Return SDUSD\' and select the amount</li>' +
      '<li>Withdraw SNEO from SAR</li>' +
      '<li>Convert SNEO back to NEO</li>' +
      '</ol>' +
      '</div>',
  },
  {
    zhQue: '我的SAR抵押率过低时，该怎么办？',
    zhAns: '<div>当抵押率较低时，可以选择下面其中一种方式来提高你的抵押率：<ol>' +
      '<li>添加抵押物SNEO</li>' +
      '<li>归还SDUSD</li>' +
      '</ol></div>',
    enQue: 'What can l do if my SAR collateral rate is low?',
    enAns: '<div>When the mortgage rate is low, you can choose one of the following ways to increase your mortgage rate:<ol>' +
      '<li>Add collateral SNEO</li>' +
      '<li>Return SDUSD</li>' +
      '</ol></div>',
  },
  {
    zhQue: '他人的SAR抵押率低于150%时，我能干什么，对我有什么好处？',
    zhAns: '当他人的SAR低于150%抵押率时，你可以参与清算。任何持有 SDUSD 并开通SAR的用户均可参与清算，并以较低的折扣获得相应的抵押资产。最高可将抵押率清算到160%。但当清算后，抵押率回升到 150%及以上时，则不再继续允许对该 SAR 进行清算。\n' +
      '清算所获得的NEO的价格比市场价低10%。',
    enQue: 'What can I do when someone else’s SAR mortgage rate is less than 150%? What good is it for me?',
    enAns: '<div>When someone else\'s SAR is below the 150% mortgage rate, you can participate in liquidation. Any user holding SDUSD and having opened SAR can participate in the linquidation and obtain the corresponding mortgage assets at a lower discount. The maximum mortgage rate can be linquidated to 160%. However, when the mortgage rate rises to 150% or above after liquidation, the SAR will no longer be allowed to be liquidated.</div>' +
      '<div>The price of NEO obtained by the clearing house is 10% lower than the market price.</div>',
  },
  {
    zhQue: '建议抵押率是多少？',
    zhAns: '建议抵押率高于200%，越高越好。',
    enQue: 'What is the recommended mortgage rate?',
    enAns: 'We suggest the mortgage rate to be as high as possible with minimum 200%.',
  },
  {
    zhQue: 'SNEO是什么？',
    zhAns: 'SNEO 是由 NGD（NEO Global Development）发布的符合 NEP-5 规范的合约资产，SNEO 可由 NEO 一比一地对换，并且支持退回操作。该合约的目的是将 NEO 进行全局资产的合约映射，使全局资产 NEO 可以方便地在合约内部流转，支持由合约调用转账，而且本合约已经提供提取GAS的功能。',
    enQue: 'What is SNEO? ',
    enAns: 'SNEO: due to the fact that the minimum unit of NEO is 1. Its segmentation is\n' +
      'not allowed. Thus SNEO is needed for calculation purpose. The minimum unit\n' +
      'of SNEO is 0.00000001. The exchange ratio between NEO and SNEO is\n' +
      'constantly 1: 1. At any time, user can freely convert SNEO to NEO and vice versa\n' +
      'in Alchemint platform.'
  },
  {
    zhQue: '稳定币发行费率是什么？',
    zhAns: '发行费率是根据所发行的SDUSD数量来计算的，将以SDS形式支付',
    enQue: 'What\'s collateral fee? ',
    enAns: 'mortgage is calcualted based on how many SDUSD the SAR owner issued, it will be paid in SDS',
  },
  {
    zhQue: '如何计费？',
    zhAns: '归还SDUSD时，所需缴纳的SDS费率计算公式为:（当前区块高度 - 借出SDUSD的区块高度）* 归还数额 * 费率 / SDS市价',
    enQue: 'How to calcualte the collateral fee?',
    enAns: '<div>How to calculated the collateral fee:</div>' +
      '<div>(Current block height - The block height in which SDUSD is issued) * SDUSD return amount * Mortgage rate / SDS market price</div>',
  },
  {
    zhQue: '目前费率是多少？',
    zhAns: '目前平台稳定币费率为2%',
    enQue: 'What\'s the current rate of collateral fee?',
    enAns: 'The current mortgage fee is 2%,Alchemint foundation will modify the mortgage fee based on platform development status and NEO’s market price.'
  },
  {
    zhQue: '抵押着的NEO会分发GAS么？',
    zhAns: '会',
    enQue: 'If I collateral NEO, will I get the GAS generated from my NEO?',
    enAns: 'Yes',
  },
  {
    zhQue: 'GAS的分发机制是什么？',
    zhAns: '一般情况下，针对钱包内的NEO所产生的GAS，每月初分发一次。针对SNEO产生的GAS暂时不会分发，SNEO转化为NEO后的下一个月初，系统会把所累计的GAS一次性分发给用户。',
    enQue: 'What\'s the mechanism of GAS distrubution?',
    enAns: 'In general, the GAS generated for the NEO in the wallet is distributed at the beginning of each month. The GAS generated for SNEO will not be distributed for the time being. At the beginning of the next month after SNEO is converted to NEO, the system will distribute the accumulated GAS to users at one time.',
  },
  {
    zhQue: '如何获取NEO&SDS市场价的？',
    zhAns: '<ul>' +
      '<li>目前已选取10个NEO喂价节点，系统将进行实时排序，并取得中位数作为系统喂价。系统每6分钟按顺序更新其中一个节点的价格。</li>' +
      '<li>SDS的价格则取自于2个喂价节点的平均数。</li>' +
      '</ul>',
    enQue: 'How does the system feed the market price for NEO and SDS?',
    enAns: '<div>' +
      '<div>At present, 10 NEO feed nodes have been selected, the system will perform real-time sorting, and the median will be used as the system feed price. The system will update the price of one of the nodes in order every 6 minutes.</>' +
      '<div>The price of the SDS is taken from the average of the two feed nodes. </div>' +
      '</div>',
  },
  {
    zhQue: 'Oracle喂价器的喂价节点有哪些？',
    zhAns: '<div>' +
      '<div>NEO和GAS的喂价节点：Bibox, Binance, Bitfinex, EXX, Bittrex, Huobi, OKEX, Gate, HitBTC 和ZB</div>' +
      '<div>SDS的喂价节点：Bilaxy 和 Coinmex</div>' +
      '</div>',
    enQue: 'What\'s the feeding nodes in Oracel?',
    enAns: '<div>' +
      '<div>Feeding nodes for NEO and GAS: Bibox, Binance, Bitfinex, EXX, Bittrex, Huobi, OKEX, Gate, HitBTC and ZB</div>' +
      '<div>Feeding node of SDS: Bilaxy and Coinmex</div>' +
      '</div>',
  },
  {
    zhQue: 'SDUSD可以在哪里使用？',
    zhAns: '<div>DUSD目前可以在以下场景使用：' +
      '<ol>' +
      '<li>使用SDUSD参与清算</li>' +
      '<li>在Switcheo（https://switcheo.exchange）以及CoinMex（https://coinmex.com）进行交易 </li>' +
      '</ol></div>',
    enQue: 'Where can I use SDUSD?',
    enAns: '<div>SDUSD can be used in these scenario:' +
      '<ol>' +
      '<li>Participate Liquidation on Alchemint Platform;</li>' +
      '<li>Use as base currency to trade on Switcheo (https://switcheo.exchange)</li>' +
      '</ol></div>',
  },
  {
    zhQue: '如何获取更多帮助？',
    zhAns: '如需帮助，请邮件至service@alchemint.io询问.',
    enQue: 'How can I get more help?',
    enAns: 'If you need more help, feel free to email Service@alchemint.io.',
  },
  {
    zhQue: 'SDUSD如何保持稳定，机制是什么?',
    zhAns: '保持SDUSD的稳定是通过超额抵押、清算奖励、伺机者参与、风控参数调节等一些列机制来实现的。在该机制下，市场参与者有动力在SDUSD脱锚时通过抵押发行、清算、购买和抛售等一些列行为，对SDUSD的价格进行修正，并从中获得收益。',
    enQue: 'How does Alchemint keep SDUSD pegged to the U.S. Dollar?',
    enAns: 'Maintaining the stability of SDUSD is achieved through a number of mechanisms such as over-collateralization, clearing incentives, opportunistic participation, and risk control parameter adjustment. Under this mechanism, market participants have the incentive to correct the price of SDUSD through the mortgage and issue, liquidation, purchase and sell-off when the SDUSD is un-anchored, and get the proceeds from it.',
  },
  {
    zhQue: '如何使用O3钱包发行SDUSD？',
    zhAns: 'O3钱包目前仅支持一键发币，尚不支持在O3钱包内归还SDUSD。请参考“如何使用一键发币功能？”获取更多信息',
    enQue: 'How can a person use O3’s Alchemint App to mortgage NEO and receive the Stablecoin SDUSD?',
    enAns: 'At present, O3 wallet only supports“One-click mint” function. If you need to return SDUSD, please use web browser to performance the action.\n' +
      'For more details about “One-click mint”, please refer the next question.',
  },
  {
    zhQue: '一键发币功能？',
    zhAns: '<div>使用一键发币，只需要选择你想生成X数量的SDUSD以及你想抵押Y数量的NEO，即可发行SDUSD。' +
      '<div>点击一件发币后，系统将在后台进行如下操作：</div>' +
      '<ol>' +
      '<li>开启SAR</li>' +
      '<li>转换Y数量的NEO成为SNEO</li>' +
      '<li>存入Y数量的SNEO进入SAR</li>' +
      '<li>产生X数量的SDUSD</li>' +
      '</ol></div>',
    enQue: 'How to use One-Click issue function?',
    enAns: '<div>To use One-Click issue function, you only need to select X amount of SDUSD you want to generate and Y amount of NEO you want to mortgage. You can issue SDUSD.' +
      '<div>After clicking on a piece of currency, the system will do the following in the background:</div>' +
      '<ol>' +
      '<li>Turn on SAR</li>' +
      '<li>Converting Y amount of NEO to SNEO</li>' +
      '<li>Deposit Y amount of SNEO into the SAR</li>' +
      '<li>Generate X amount of SDUSD</li>' +
      '</ol></div>',
  },
  {
    zhQue: 'SDS和SDUSD的区别是什么？',
    zhAns: '<div>SDS：阿基米德项目的平台通证。在 SAR-C 中，充当稳定币回收时所需抵扣的手 续费。SDS价格与大多数数字货币一样，会有大幅波动。</div>' +
      '<div>SDUSD是价格锚定1美元的稳定币，其价格不会剧烈波动。</div>',
    enQue: 'What is the difference between SDS and SDUSD?',
    enAns: '<div>SDS: it refers to Alchemint platform token. It acts as a mean to pay for collateral service fee. The price of SDS will fluctuate like other cryptocurrencies.</div>' +
      '<div>SDUSD: it is pegged to 1 USD. The price of SDUSD will not fluctuate much.</div>',
  },
  {
    zhQue: 'SDUSD全局发行上限是什么？如果到达上限会发生什么？',
    zhAns: 'SDUSD全局发行上限是阿基米德基金会依照目前平台发展情况以及NEO市值规模所设置的。当SDUSD的发行量到达SDUSD全局发行上限时，用户将无法发行SDUSD，直至有用户归还SDUSD。\n' +
      '阿基米德基金会将依照情况逐步提高SDUSD全局发行上限。',
    enQue: 'What\'s is the ceiling? What\'s will happend when it reaches the ceiling?',
    enAns: 'The SDUSD Overall Issuing Ceiling is set by Alchemint Foundation, the number is based by the Alchemint platform development and NEO’s market value. When SDUSD reach the ceiling, user can not issue SDUSD unless someone returns some SDUSD first. Alchemint foundation will increase the overall issuing ceiling based on SDUSD issuing situation.',
  },
  {
    zhQue: 'SAR-B和SAR-C的区别是什么？',
    zhAns: '<div>SAR-B：主要面向商业机构用户，机构通过链下的 100%法币储备以及链上的通 过智能合约锁定的 SDS 作为保证金来发行稳定币。每个 SAR 会锁定 SDS，并根 据锁定 SDS 的市值以及设置的最低保证金比例决定机构可以发行的稳定币数量。目前最低保证金比例为 50%。SAR-B创建者可以自行定义该币的缩写。</div>' +
      '<div>SAR-C：主要面向个人用户和商业机构，通过超额抵押数字资产的方式发行稳定币，稳定币名字为 SDUSD。SDUSD是标准的NEP-5代币。</div>',
    enQue: 'What are the differences between SAR-B and SAR-C?',
    enAns: '<div>SAR-B: Stablecoin is issued through the means of the 100% off-chain currency reserves and on-chain SDS locked as a security deposit by smart contract. Each SAR will lock SDS. The market value and the minimum margin ratio of SDS determine the number of stablecoin that can be released. The current minimum deposit ratio of 50%. </div>' +
      '<div>SAR-C: Mainly for individual users and business users. Stablecoin is issued by over-collateralizing digital assets. The stablecoin name is SDUSD. SDUSD is NEP-5 asset can be transfer via NEO wallet.</div>',
  },
  {
    zhQue: 'SDUSD是否安全？',
    zhAns: 'SDUSD的背后拥有至少150%的NEO资产储备，也就是说每一个SDUSD的背后都有至少价值1.5美元的NEO作为抵押资产。如果NEO价格下降使得SDUSD背后的抵押资产减少至低于1.5倍，此时伺机者有权利以90%的市场价格购买SAR中的部分NEO并替SAR的创建者归还其部分债务，通过此方式使得SDUSD的资产抵押率始终保持在1.5倍以上。',
    enQue: 'How does Alchemint keep SDUSD safe?',
    enAns: 'SDUSD has at least 150% NEO asset reserves behind it, which means that each SDUSD has at least $1.50 NEO as a collateral asset. If the NEO price declines which reduces the mortgage asset value behind the SDUSD to less than 1.5 times,  the opportunist has the right to purchase part of the NEO in the SAR at 90% of the market price and replace the SAR creator to return part of the debt. In this way the asset mortgage rate of SDUSD has remained above 1.5 times.',
  },
];
