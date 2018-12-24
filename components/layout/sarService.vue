<template>
  <el-dialog :title="$t('nav.termsService')"
             custom-class="sar-service-modal"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :show-close="false"
             :lock-scroll="true"
             :modal="true"
             :append-to-body="true"
             center>
    <div v-if="$i18n.locale==='en'" class="sar-service-content">
      <div class="item">
        <h1 class="title">1. Acceptance of Terms</h1>
        <div class="content">The SAR-C and SAR-B System and Software is an autonomous system of smart contracts on the
          NEO Blockchain
          (the “Open Source Software”), that permits, among other things, the generation of SAR-C and SAR-B. SDUSD and
          SAR-C tokens are cryptocurrencies intended to maintain low volatility that is available at
          Mainnet.Alchemint.io and via other tools (the “Site”) — which includes text, images, audio, code and other
          materials (collectively, the “Content”) and all of the features, and services provided. The Site, and any
          other features, tools, materials, the Open Source Software, or other services offered from time to time are
          referred to here as the “Service.” Note however, that while the Open Source Software is intended to maintain
          low volatility for SAR-C and SAR-B, the Open Source Software is an experimental prototype and its use involves
          a high degree of risk. There are numerous ways the Open Source Software and Service could fail in an
          unexpected way, resulting in the total and absolute loss of all of your funds.
        </div>
        <div class="content">Please read these Terms of Use (the “Terms” or “Terms of Use”) carefully before using the
          Service. By using
          or otherwise accessing the Service, or clicking to accept or agree to these Terms where that option is made
          available, you (1) accept and agree to these Terms and (2) any additional terms, rules and conditions of
          participation issued from time to time. If you do not agree to the Terms, then you may not access or use the
          Content or Service.
        </div>
      </div>
      <div class="item">
        <h1 class="title">2. Modification of Terms of Use</h1>
        <div class="content">These Terms may be discretionarily modified or replaced at any time, unless stated
          otherwise herein. The
          most current version of these Terms will be posted on the Site with the “Last Revised” date at the top of the
          Terms changed. Any changes or modifications will be effective immediately upon posting the revisions to the
          Site. You shall be responsible for reviewing and becoming familiar with any such modifications. You waive any
          right you may have to receive specific notice of such changes or modifications. Use of the Service by you
          after any
          modification to the Terms constitutes your acceptance of the Terms as modified. If you do not agree to the
          Terms in effect when you access or use the Service, you must stop using the Service.
        </div>
      </div>
      <div class="item">
        <h1 class="title">3. Eligibility</h1>
        <div class="content">You hereby represent and warrant that you are fully able and competent to enter into the
          terms, conditions,
          obligations, affirmations, representations and warranties set forth in these Terms and to abide by and comply
          with these Terms.
        </div>
        <div class="content">The SAR-C and SAR-B System and Software is global and by accessing the Content or Service,
          you are
          representing and warranting that, you are of the legal age of majority in your jurisdiction as is required to
          access such Service and Content and enter into arrangements as provided by the Service. You further represent
          that you are otherwise legally permitted to use the service in your jurisdiction including owning
          cryptographic tokens of value, and interacting with the Service or Content in any way. You further represent
          you are responsible for ensuring compliance with the laws of your jurisdiction and acknowledge that Alchemint
          or any of the Alchemint Volunteers (as defined below) is not liable for your compliance with such laws.
          Finally, you represent and warrant that you will not use the Service for any illegal activity.
        </div>
      </div>
      <div class="item">
        <h1 class="title">4. Representations, Warranties, and Risks</h1>
        <h2 class="sub-title">4.1. No Representation or Warranty.</h2>
        <div class="content">You expressly understand and agree that your use of the Service is at your sole risk.
          (A) ALL PERSONS, ENTITIES, AGENTS, AND VOLUNTEERS INVOLVED WITH THE CREATION OF THE SAR-C AND SAR-B SYSTEM AND
          SOFTWARE (“ALCHEMINT VOLUNTEERS”) MAKE AND EXPRESSLY DISCLAIM ALL REPRESENTATIONS AND WARRANTIES, EXPRESS,
          IMPLIED OR STATUTORY; AND (B) WITH RESPECT TO THE SAR-C AND SAR-B SYSTEM AND SOFTWARE AND SAR-C AND SAR-B
          TOKENS, ALCHEMINT VOLUNTEERS AND ALL RELATED ENTITIES AND AGENTS SPECIFICALLY DO NOT REPRESENT AND WARRANT AND
          EXPRESSLY DISCLAIM ANY REPRESENTATION OR WARRANTY, EXPRESS, IMPLIED OR STATUTORY, INCLUDING WITHOUT
          LIMITATION, ANY REPRESENTATIONS OR WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, USAGE, SECURITY,
          SUITABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE, OR AS TO THE WORKMANSHIP OR TECHNICAL CODING THEREOF, OR
          THE ABSENCE OF ANY DEFECTS THEREIN, WHETHER LATENT OR PATENT. THE ALCHEMINT VOLUNTEERS OR ANY RELATED ENTITIES
          OR AGENTS DO NOT REPRESENT OR WARRANT THAT THE SERVICE AND ANY RELATED INFORMATION ARE ACCURATE, COMPLETE,
          RELIABLE, CURRENT OR ERROR-FREE.
        </div>
        <h2 class="sub-title">4.2. Disclaimer of Fiduciary Duties</h2>
        <div class="content">TO THE FULLEST EXTENT PERMITTED BY LAW AND NOTWITHSTANDING ANY OTHER PROVISION OF THIS
          AGREEMENT OR ANY
          OTHER AGREEMENT CONTEMPLATED HEREIN OR APPLICABLE PROVISIONS OF LAW OR EQUITY OR OTHERWISE, THE PARTIES HERETO
          HEREBY AGREE TO ELIMINATE ANY AND ALL FIDUCIARY DUTIES THE ALCHEMINT VOLUNTEERS OR ANY RELATED ENTITIES AND
          AGENTS MAY HAVE TO THE USER, ITS AFFILIATES, OR THE END USERS OF THE SERVICE, THE SITE OR ITS CONTENT,
          PROVIDED THAT SUCH EXCLUSION OR LIMITATION OF LIABILITY SHALL NOT EXTEND TO MISAPPROPRIATION OF ASSETS OR
          FUNDS OF THE USERS, ITS AFFILIATES, OR THE END USERS OF THE SERVICES, SITE OR CONTENT PROVIDED BY THE
          ALCHEMINT VOLUNTEERS OR ANY RELATED ENTITIES AND AGENTS OR OTHER ACTS OR OMISSIONS THAT CONSTITUTE A BAD FAITH
          VIOLATION OF THE IMPLIED CONTRACTUAL COVENANT OF GOOD FAITH AND FAIR DEALING.
        </div>
        <div class="content">IT IS FULLY UNDERSTOOD THAT ALCHEMINT VOLUNTEERS AND ALL AFFILIATE COMPANIES AND AGENTS
          HAVE MADE IT CLEAR
          THAT THEY WILL NOT GUARANTEE THE REAL-TIME PAYMENT, DEPOSIT RETENTION AND ENTITIES OF THE SAR-B EXCLUSIVE
          STABLECOIN ISSUER. SAR-B EXCLUSIVE STABLECOIN USERS MUST BE FULLY AWARE OF THE ISSUER'S CREDIT BEFORE USING
          SAR-B EXCLUSIVE STABLECOIN. YOU DECLARE AND YOU FULLY UNDERSTAND THAT ALCHEMINT VOLUNTEERS AND ALL AFFILIATE
          COMPANIES AND AGENTS ARE NOT RESPONSIBLE FOR LEGAL DISPUTES BETWEEN SAR-B EXCLUSIVE STABLECOIN ISSUER AND
          SAR-B USERS.
        </div>
        <h2 class="sub-title">4.3 Sophistication and Risk of Cryptographic Systems</h2>
        <div class="content">By utilizing the Service or interacting with the Content in any way, you represent that you
          understand the
          inherent risks associated with cryptographic systems; and warrant that you have an understanding of the usage
          and intricacies of native cryptographic tokens, like NEO、Ether (ETH) and Bitcoin (BTC), smart contract based
          tokens such as those that follow the NEO Enhancement Proposals
          (https://github.com/neo-project/proposals/blob/master/nep-5.mediawiki), and blockchain-based software systems.
        </div>
        <div class="content">Neither of the Alchemint Volunteers own or control any of the underlying software through
          which blockchain
          networks are formed. In general, the underlying software for blockchain networks tends to be open source such
          that anyone can use, copy, modify, and distribute it. By using the Service, you acknowledge and agree (i) that
          Alchemint Volunteers or related entities are not responsible for operation of the underlying software and
          networks that there exists no guarantee of functionality, security, or availability of such software and
          networks; and (ii) that the underlying protocols are subject to sudden changes in operating rules (known as
          “Forks”), and that such Forks may materially affect the SAR System and Software. It might be discretionarily
          decided not to support (or cease supporting) the Forked network entirely. You acknowledge and agree that
          Alchemint volunteers assume absolutely no responsibility whatsoever in respect of any underlying software
          protocols, whether Forked or not.
        </div>
        <h2 class="sub-title">4.4 Risk of Regulatory Actions in One or More Jurisdictions</h2>
        <div class="content">The SAR-C and SAR-B System and Software, Alchemint and NEO could be impacted by one or more
          regulatory
          inquiries or regulatory action, which could impede or limit the ability of Alchemint Volunteers to continue to
          develop, or which could impede or limit your ability to access or use the Service or NEO blockchain, including
          access to your funds.
        </div>
        <h2 class="sub-title">4.5 Risk of Weaknesses or Exploits in the Field of Cryptography</h2>
        <div class="content">You acknowledge and understand that Cryptography is a progressing field. Advances in code
          cracking or
          technical advances such as the development of quantum computers may present risks to cryptocurrencies and
          Service or Content, which could result in the theft or loss of your cryptographic tokens or property. To the
          extent possible, it is intended to update the protocol underlying the Service to account for any advances in
          cryptography and to incorporate additional security measures, but does not guarantee or otherwise represent
          full security of the system. By using the Service or accessing Content, you acknowledge these inherent risks.
        </div>
        <h2 class="sub-title">4.6 Volatility of Cryptocurrency</h2>
        <div class="content">You understand that NEO and other blockchain technologies and associated currencies or
          tokens are highly
          volatile due to many factors including but not limited to adoption, speculation, technology and security
          risks. You also acknowledge that the cost of transacting on such technologies is variable and may increase at
          any time causing impact to any activities taking place on the NEO blockchain. You acknowledge these risks and
          represent that Alchemint Volunteers or any related entity or person cannot be held liable for such
          fluctuations or increased costs.
        </div>
        <h2 class="sub-title">4.7 Application Security</h2>
        <div class="content">You acknowledge that the SAR-C and SAR-B System and Software is subject to flaws and
          acknowledge that you
          are solely responsible for evaluating any code provided by the Services or Content. This warning and others
          later provided by Alchemint Volunteers in no way evidence or represent an on-going duty to alert you to all of
          the potential risks of utilizing the Service or Content.
        </div>
        <h2 class="sub-title">4.8 Website Accuracy</h2>
        <div class="content">Although it is intended to provide accurate and timely information on the Site and other
          tools making up
          the SAR-C and SAR-B System and Software, the Site (including, without limitation, the Content) or relevant
          tools may not always be entirely accurate, complete or current and may also include technical inaccuracies or
          typographical errors. In an effort to continue to provide you with as complete and accurate information as
          possible, information may be changed or updated from time to time without notice, including without limitation
          information regarding our policies. Accordingly, you should verify all information before relying on it, and
          all decisions based on information contained on the Site or relevant tools are your sole responsibility and
          Alchemint volunteers shall have no liability for such decisions. Links to third-party materials (including
          without limitation websites) may be provided as a convenience but are not controlled by any entity. You
          acknowledge and agree that we are not responsible for any aspect of the information, content, or services
          contained in any third-party materials or on any third party sites accessible or linked to the Site or
          available via other relevant tools.
        </div>
        <h2 class="sub-title">4.9 Technical Knowledge</h2>
        <div class="content">Any use or interaction with the SAR System and Software requires a comprehensive
          understanding of applied
          cryptography and computer science in order to appreciate inherent risks, including those listed above. You
          represent and warrant that you possess relevant knowledge and skills.
        </div>
      </div>
      <div class="item">
        <h1 class="title">5. Indemnity</h1>
        <div class="content">You agree to release and to indemnify, defend and hold harmless Volunteers and any related
          entities, as
          well as the officers, directors, employees, shareholders and representatives of any of the foregoing entities,
          from and against any and all losses, liabilities, expenses, damages, costs (including attorneys’ fees, fees or
          penalties imposed by any regulatory authority and court costs) claims or actions of any kind whatsoever
          arising or resulting from your use of the Service, your violation of these Terms of Use, your violation of any
          law, rule, or regulation, or the rights of any third party, and any of your acts or omissions that implicate
          publicity rights, defamation or invasion of privacy. Each of the he Alchemint Volunteers reserve the right, at
          its own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by
          you and, in such case, you agree to cooperate with Alchemint Volunteers in the defense of such matter.
        </div>
      </div>
      <div class="item">
        <h1 class="title">6. Limitation on liability</h1>
        <div class="content">YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR YOUR USE OF THE SITE AND
          SERVICE. YOU
          ACKNOWLEDGE AND AGREE THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITE AND SERVICE MAY NOT
          BE SECURE AND MAY BE INTERCEPTED OR LATER ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT
          YOUR USE OF THE SITE AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING SUCH, YOU UNDERSTAND AND AGREE THAT, TO THE
          FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER ALCHEMINT VOLUNTEERS NOR ANY RELATED ENTITIES, SUPPLIERS
          OR LICENSORS WILL BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE,
          EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL,
          USE, DATA OR OTHER TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT, TORT, STRICT
          LIABILITY OR ANY OTHER THEORY (EVEN IF ANY OF THE ALCHEMINT VOLUNTEERS OR RELATED ENTITIES HAD BEEN ADVISED OF
          THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE SITE OR SERVICE; THE USE OR THE INABILITY TO USE THE SITE
          OR SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT OF ANY
          THIRD PARTY ON THE SITE OR SERVICE; ANY ACTIONS WE TAKE OR FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND
          TO US; HUMAN ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY OR TELEPHONE OUTAGES;
          OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE
          (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE
          TO COMPUTER EQUIPMENT; INABILITY TO FULLY ACCESS THE SITE OR SERVICE OR ANY OTHER WEBSITE; THEFT, TAMPERING,
          DESTRUCTION, OR UNAUTHORIZED ACCESS TO, IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR
          INCORRECTLY OR IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR ANY COMBINATION THEREOF; OR
          ANY OTHER MATTER RELATING TO THE SITE OR SERVICE.
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF
          LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO
          YOU.
        </div>
      </div>
      <div class="item">
        <h1 class="title">7. Our Proprietary Rights</h1>
        <div class="content">All title, ownership and intellectual property rights in and to the Service are owned by
          Alchemint
          Volunteers, related entities or their licensors. You acknowledge and agree that the Service contains
          proprietary and confidential information that is protected by applicable intellectual property and other laws.
          Except as expressly authorized by relevant entity, you agree not to copy, modify, rent, lease, loan, sell,
          distribute, perform, display or create derivative works based on the Service, in whole or in part.
        </div>
      </div>
      <div class="item">
        <h1 class="title">8. Links</h1>
        <div class="content">The Service provides, or third parties may provide, links to other World Wide Web or
          accessible sites,
          applications or resources. Because neither of the Alchemint Volunteers has control over such sites,
          applications and resources, you acknowledge and agree that Alchemint Volunteers or any related entity is not
          responsible for the availability of such external sites, applications or resources, and does not endorse and
          is not responsible or liable for any content, advertising, products or other materials on or available from
          such sites or resources. You further acknowledge and agree that Alchemint Volunteers or any related entity
          shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be
          caused by or in connection with use of or reliance on any such content, goods or services available on or
          through any such site or resource.
        </div>
      </div>
      <div class="item">
        <h1 class="title">9. Termination and Suspension</h1>
        <div class="content">Alchemint may terminate or suspend all or part of the Service and your SAR System and
          Software access
          immediately, without prior notice or liability, if you breach any of the terms or conditions of the Terms.
          Upon
          termination of your access, your right to use the Service will immediately cease.
          The following provisions of the Terms survive any termination of these Terms: INDEMNITY; WARRANTY DISCLAIMERS;
          LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS; LINKS; TERMINATION; NO THIRD-PARTY BENEFICIARIES; BINDING
          ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.
        </div>
      </div>
      <div class="item">
        <h1 class="title">10. No Third-Party Beneficiaries</h1>
        <div class="content">You agree that, except as otherwise expressly provided in these Terms, there shall be no
          third party
          beneficiaries to the Terms.
        </div>
      </div>
      <div class="item">
        <h1 class="title">11. Notice and Procedure For Making Claims of Copyright Infringement</h1>
        <div class="content">If you believe that your copyright or the copyright of a person on whose behalf you are
          authorized to act
          has been infringed, please provide a written Notice (Legal@alchemint.io) containing the following information:
        </div>
        <ul class="content">
          <li>an electronic or physical signature of the person authorized to act on behalf of the owner of the
            copyright or other intellectual property interest;
          </li>
          <li>a description of the copyrighted work or other intellectual property that you claim has been infringed;
          </li>
          <li>a description of where the material that you claim is infringing is located on the Service;</li>
          <li>your address, telephone number, and email address;</li>
          <li>a statement by you that you have a good faith belief that the disputed use is not authorized by the
            copyright owner, its agent, or the law;
          </li>
          <li>a statement by you, made under penalty of perjury, that the above information in your Notice is accurate
            and that you are the copyright or intellectual property owner or authorized to act on the copyright or
            intellectual property owner's behalf.
          </li>
        </ul>
      </div>
      <div class="item">
        <h1 class="title">12. Arbitration and Class Action Waiver</h1>
        <h2 class="sub-title">12.1 Initial Dispute Resolution</h2>
        <div class="content">The parties agree shall use their best efforts to engage directly to settle any dispute,
          claim, question,
          or disagreement and engage in good faith negotiations which shall be a condition to either party initiating a
          arbitration.
        </div>
        <h2 class="sub-title">12.2 Binding Arbitration</h2>
        <div class="content">If we cannot resolve the dispute through good-faith negotiations, you and we agree that any
          dispute arising
          under this Agreement shall be finally settled in binding arbitration, on an individual basis, in accordance
          with the American Arbitration Association's rules for arbitration of consumer-related disputes and you and
          Alchemint hereby expressly waive trial by jury and right to participate in a class action lawsuit or
          class-wide arbitration. The arbitration will be conducted by a single, neutral arbitrator and shall take place
          in the county or parish in which you reside, or another mutually agreeable location, in the English language.
          The arbitrator may award any relief that a court of competent jurisdiction could award, including attorneys'
          fees when authorized by law, and the arbitral decision may be enforced in any court. At your request, hearings
          may be conducted in person or by telephone and the arbitrator may provide for submitting and determining
          motions on briefs, without oral hearings. The prevailing party in any action or proceeding to enforce this
          agreement shall be entitled to costs and attorneys' fees.
        </div>
        <div class="content">If the arbitrator(s) or arbitration administrator would impose filing fees or other
          administrative costs on
          you, we will reimburse you, upon request, to the extent such fees or costs would exceed those that you would
          otherwise have to pay if you were proceeding instead in a court. We will also pay additional fees or costs if
          required to do so by the arbitration administrator's rules or applicable law. Apart from the foregoing, each
          Party will be responsible for any other fees or costs, such as attorney fees that the Party may incur. If a
          court decides that any provision of this section 12.2 is invalid or unenforceable, that provision shall be
          severed and the other parts of this section 12.2 shall still apply. In any case, the remainder of this
          Agreement, will continue to apply.
        </div>
        <h2 class="sub-title">12.3 Governing law</h2>
        <div class="content">For any dispute not subject to arbitration you and Alchemint agree to submit to the
          personal and exclusive
          jurisdiction of and venue in the courts located in Singapore. You further agree to accept service of process
          by mail, and hereby waive any and all jurisdictional and venue defenses otherwise available.
        </div>
        <div class="content">The Terms and the relationship between you and Alchemint shall be governed by the laws of
          the Singapore
          without regard to conflict of law provisions.
        </div>
      </div>
      <div class="item">
        <h1 class="title">13. General Information</h1>
        <h2 class="sub-title">13.1 Entire Agreement</h2>
        <div class="content">These Terms (and any additional terms, rules and conditions of participation that may be
          posted on the
          Service) constitute the entire agreement with respect to the Service and supersedes any prior agreements, oral
          or written. In the event of a conflict between these Terms and the additional terms, rules and conditions of
          participation, the latter will prevail over the Terms to the extent of the conflict.
        </div>
        <h2 class="sub-title">13.2 Waiver and Severability of Terms</h2>
        <div class="content">The failure of any entity to exercise or enforce any right or provision of the Terms shall
          not constitute a
          waiver of such right or provision. If any provision of the Terms is found by an arbitrator or court of
          competent jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should
          endeavor to give effect to the parties' intentions as reflected in the provision, and the other provisions of
          the Terms remain in full force and effect.
        </div>
        <h2 class="sub-title">13.3 Statute of Limitations</h2>
        <div class="content">You agree that regardless of any statute or law to the contrary, any claim or cause of
          action arising out
          of or related to the use of the Service or the Terms must be filed within one (1) year after such claim or
          cause of action arose or be forever barred.
        </div>
        <h2 class="sub-title">13.4 Section Titles</h2>
        <div class="content">The section titles in the Terms are for convenience only and have no legal or contractual
          effect.
        </div>
        <h2 class="sub-title">13.5 Communications</h2>
        <div class="content">Users with questions, complaints or claims with respect to the Service may contact us using
          the relevant
          contact information set forth above and at Legal@alchemint.io.
        </div>
      </div>
      <div class="item">
        <h1 class="title">14. Prohibited Use</h1>
        <div class="content">You may not use the Service to engage in the following categories of activity ("Prohibited
          Uses"). The
          specific types of use listed below are representative, but not exhaustive. If you are uncertain as to whether
          or not your use of the Services involves a Prohibited Use, or have questions about how these requirements
          apply to you, please contact us at Legal@alchemint.io By opening using the Service provided here, you confirm
          that you will not use this Service to do any of the following:
        </div>
        <ul class="content">
          <li>Unlawful Activity: Activity which would violate, or assist in violation of, any law, statute, ordinance,
            or regulation, sanctions programs administered in any relevant country, including but not limited to the
            U.S. Department of Treasury's Office of Foreign Assets Control ("OFAC"), or which would involve proceeds of
            any unlawful activity; publish, distribute or disseminate any unlawful material or information
          </li>
          <li>Abuse Other Users: Interfere with another individual's or entity's access to or use of any Services;
            defame, abuse, extort, harass, stalk, threaten or otherwise violate or infringe the legal rights (such as,
            but not limited to, rights of privacy, publicity and intellectual property) of others; incite, threaten,
            facilitate, promote, or encourage hate, racial intolerance, or violent acts against others; harvest or
            otherwise collect information from the Site about others, including without limitation email addresses,
            without proper consent
          </li>
          <li>Fraud: Activity which operates to defraud Alchemint, SAR-C and SAR-B System and Software users, or any
            other person; provide any false, inaccurate, or misleading information.
          </li>
          <li>Intellectual Property Infringement: Engage in transactions involving items that infringe or violate any
            copyright, trademark, right of publicity or privacy or any other proprietary right under the law, including
            but not limited to sales, distribution, or access to counterfeit music, movies, software, or other licensed
            materials without the appropriate authorization from the rights holder; use of Alchemint intellectual
            property, name, or logo, including use of Alchemint trade or service marks, without express consent from
            Alchemint or in a manner that otherwise harms Alchemint; any action that implies an untrue endorsement by or
            affiliation with Alchemint.
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="sar-service-content">
      <div class="item">
        <h1 class="title">1. 接受条款</h1>
        <div class="content">SAR-C和SAR-B系统和软件是NEO网络区块链 (“开源软件”) 上的自治智能合约系统，除其他外，它允许SDUSD的产生。</div>
        <div class="content">SDUSD及SAR-B专属稳定币[对B端稳定币描述]是加密货币，旨在维持低波动性，可通过mainnet.Alchemint.io(主网网页)[正式网的网站]和其他工具(“网站”)获得
          – 也包括字体，图像，音频，代码和其他资料（统称为“内容”）和提供的所有功能和服务。
        </div>
        <div class="content">
          本网站以及任何其他功能，工具，材料，开源软件或不时提供的其他服务在此称为“服务”。但请注意，虽然该开源软件旨在保持SDUSD的低波动性，但该开源软件是一个实验产品，其使用涉及高风险。开源软件和服务可能有多种方式和意想不到的方式失败，从而导致所有资金报废。
        </div>
        <div class="content">
          在使用本服务之前，请仔细阅读这些使用条款(“条款”或“使用条款”)。通过使用或以其他方式使用服务，或选项被提供时点击接受或同意这些条款，您（1）接受并同意这些条款和（2）不时发布的任何附加条款，规则和参与条件。如果您不同意本条款，您则不得探访或使用其内容或服务。
        </div>
      </div>
      <div class="item">
        <h1 class="title">2. 修改使用条款</h1>
        <div class="content">
          除非另有说明，否则这些条款可以随时自行修改或替换。这些条款的最新版本将在本网站上发布，同时亦会更新条款顶部的“最后修订”日期。任何更改或修改将在发布至本网站后立即生效。您有责任审查经修订的条款。你放弃了关于更改或修改特定通知的权利。变更的发布后，如果您继续使用本服务，将默认为您已经同意遵守这些条款内容。如果您在探访问或使用本服务时不同意条款，您则必须停止使用。
        </div>
      </div>
      <div class="item">
        <h1 class="title">3.合格</h1>
        <div class="content">您在此声明并保证您完全有能力签订所规定的条款，条件，义务，声明，陈述和保证，遵守并依从这些条款。
        </div>
        <div class="content">
          SAR-C和SAR-B系统和软件是全球性的，通过探访内容或服务，您已声明并保证，在您所在的司法管辖区内，您已到了法定成年年龄。您也进一步声明，您在法律上被允许在您的司法管辖区内使用本服务，包括拥有有价值的加密货币，以及任何与本服务或内容的互动。您也进一步声明您有责任确保遵守您所在司法辖区的法律，并确认Alchemint或任何Alchemint志愿者（定义见下文）不承担任何您必须遵守的法律责任。最后，您声明并保证不使用本服务进行任何形式的犯罪活动。
        </div>
      </div>
      <div class="item">
        <h1 class="title">4. 陈述，保证和风险</h1>
        <h2 class="sub-title">4.1. 无陈述或保证</h2>
        <div class="content">（A）参与创建SAR-C及SAR-B系统和软件的所有人员，实体，代理人和志愿者（“Alchemint志愿者”）做出并明确拒绝所有，隐含或法定的陈述和保证;
          和（B）关于SAR-C及SAR-B系统和软件及SDUSD
          TOKENS，SAR-B专属稳定币，Alchemint志愿者及所有关联公司和代理商明确表示不承担任何责任，包括但不限于任何隐含或法定的陈述和保证，对所有权，非侵权，商销性，使用，安全性，适用性或特定用途适用性的任何陈述或保证,
          或者对于其工作或技术编码，或者在任何没有任何缺陷的情况下，无论是潜在还是专利的。Alchemint志愿者或任何关联公司或代理人不代表或保证本服务及任何相关信息的准确性，完整性，可靠性，当前性或无错误性。
        </div>
        <h2 class="sub-title">4.2. 信托义务免责声明</h2>
        <div class="content">
          在法律允许的最大范围内，尽管本协议或此处所述的任何其他协议的任何其他规定或适用的法律或公平或其他规定，本协议双方同意消除Alchemint志愿者或任何关联公司的任何和所有信托义务
          和代理商可能有权向用户，其关联公司或服务，网站或其内容的最终用户提供此类排除或责任限制，提供此类排除或责任限制不得延伸到对用户，其关联公司的资产或资金的误用，或Alchemint志愿者或任何关联公司和代理人提供的服务，网站或内容的最终用户，或其他行为或遗漏构成了对违反良好信仰和公平交易的合同契约的不信任。
        </div>
        <div class="content">
          本协议双方了充分了解，Alchemint志愿者及所有关联公司和代理商明确表示不对SAR-B专属稳定币发行方实时兑付、保证金留存及其实体做出保证。SAR-B的专属稳定币使用者是充分了解发行方信用，并继续使用SAR-B的专属稳定币。您声明您了解Alchemint志愿者及所有关联公司和代理商不会为SAR-B专属稳定币发行方及SAR-B的使用方所产生的法务纠纷负责。[针对B端的法律免责条款]
        </div>
        <h2 class="sub-title">4.3 密码系统的复杂性和风险</h2>
        <div class="content">
          通过使用服务或任何与内容互动的方式，您表示您了解与加密系统相关的固有风险;
          并保证您了解本机加密货币的用法和复杂性，如以太币（ETH）和比特币（BTC），这类的智能合约的代币都遵循NEO令牌标准(https://github.com/neo-project/proposals/blob/master/nep-5.mediawiki)[NEP-5的GITHUB]和基于区块链的软件系统。
        </div>
        <div class="content">
          Alchemint志愿者都不拥有或控制通过其形成区块链网络的任何底层软件。通常，区块链网络的底层软件往往是开源的，任何人都可以使用，复制，修改和分发它。使用本服务即表示您承认并同意（i）Alchemint志愿者或关联公司不对软件和网络的运行负责，因为这些软件和网络不保证此类软件和网络的功能，安全性或可用性;
          和（ii）基础协议受操作规则的突然变化（称为
          “Forked”），并且此类Forked可能对SAR-C及SAR-B系统和软件产生重大影响。可以自行决定不再全面支持（或停止支持）Forked网络。您承认并同意Alchemint志愿者对任何基础软件协议（无论是否为Forked）绝对不承担任何责任。
        </div>
        <h2 class="sub-title">4.4 一个或多个司法管辖区的监管行为风险s</h2>
        <div class="content">
          SAR-C及SAR-B系统和软件，Alchemint和NEO可能受到一个或多个监管查询或监管行动的影响，这可能会阻碍或限制Alchemint志愿者继续发展的能力，或者可能阻碍或限制您探访或使用服务或NEO区块链，包括探访您的资金。
        </div>
        <h2 class="sub-title">4.5 密码学领域的弱点或漏洞风险</h2>
        <div class="content">
          您确认并理解密码学是一个日新月异的领域。代码破解或技术进步，例如量子计算机的开发可能会对加密货币和服务或内容带来风险，这可能导致您的加密货币或财产被盗或丢失。在可能的范围内，旨在更新服务的基础协议，以考虑密码学的任何进展并纳入其他安全措施，但不保证或以其他方式代表系统的完全安全性。通过使用服务或探访内容，您确认这些固有风险。
        </div>
        <h2 class="sub-title">4.6 加密货币的波动性</h2>
        <div class="content">
          您了解NEO区块链网络和其他区块链技术及相关货币或代币由于许多因素，包括但不限于采用，投机，技术和安全风险而极易波动。您确认，对这些技术进行交易的费用会波动，并且可能随时增加，从而对NEO区块链网络上发生的任何活动造成影响。您确认这些风险并表示Alchemint志愿者或任何关联公司或个人不对此类波动或成本的增加承担责任。
        </div>
        <h2 class="sub-title">4.7 应用安全</h2>
        <div class="content">您承认SAR-C及SAR-B系统和软件或存在缺陷，并承认您自行负责评估服务或内容提供的任何代码。
          此警告以及稍后由Alchemint志愿者提供的其他警告绝不会证明或代表正在履行的职责，提醒您使用服务或内容的所有潜在风险。
        </div>
        <h2 class="sub-title">4.8 网站准确性</h2>
        <div class="content">
          虽然本网站旨在提供SAR-C及SAR-B系统和软件准确和及时的信息，但本网站（包括但不限于内容）或相关工具可能并不总是完全准确，完整或最新，并且可能还包括技术错误或排印错误。为了继续向您提供尽可能完整和准确的信息，信息将会不时更改或更新，恕不另行通知，更改或更新包括但不限于有关我们政策内容。您不能依赖网站上的信息，您一定在执行信息之前采取适当步骤确认该信息，决定均由您自行负责，Alchemint志愿者对此类决定不承担任何责任。我方可以因方便为您提供与第三方（包括但不限于网站）的链接，但不受任何实体控制。您确认并同意，对于任何第三方材料或任何可探访或网站链接获得的内容或服务，我们概不负责。
        </div>
        <h2 class="sub-title">4.9 技术知识</h2>
        <div class="content">欲了解任何与SAR-C及SAR-B系统和软件的使用或交流的固有风险，包括上面列出的风险，都需要全面了解应用密码学和计算机科学。您声明并保证您拥有相关知识和技能。
        </div>
      </div>
      <div class="item">
        <h1 class="title">5.赔款</h1>
        <div class="content">
          您同意发布并赔偿，捍卫和保护Alchemint志愿者和任何关联公司，以及任何上述实体的官员，董事，员工，股东和代表，免受任何和所有损失，责任，赔偿，损坏，费用（包括律师费，任何监管机构征收的费用或处罚以及法院费用）因使用服务而产生任何形式的索赔或诉讼，您违反任何法律，规则或法规，或任何第三方的权利，以及任何涉及公开权，诽谤或侵犯隐私权的行为或疏忽。每个Alchemint志愿者保留自行承担对您需要赔偿的任何事项的独家辩护和控制权，在这种情况下，您同意与Alchemint志愿者合作以保护此类事项。
        </div>
      </div>
      <div class="item">
        <h1 class="title">6.责任限制</h1>
        <div class="content">
          您承认并同意您对使用本网站和服务承担全部责任。您承认并同意，您在使用本网站和服务期间发送或接收的任何信息可能不安全，可能被未经授权的各方截取或稍后获得。您承认并同意您自行承担使用本网站和服务的风险。认识到这一点，您理解并同意，在适用法律允许的最大范围内，Alchemint志愿者或任何关联公司，供应商或许可方均不对您的任何直接，间接，偶然，特殊，后果性，惩罚性，示范性或任何形式的其他损害对您承担任何责任，包括但不限于损失利润，商誉，使用，数据或其他有形或无形的损失或基于合同，侵权，严格责任或任何其他理论的任何其他损害（即使任何Alchemint志愿者或关联公司已被告知此类损害的可能性），由网站或服务产生的;使用或无法使用本网站或服务；未经授权访问或更改您的传输或数据;本网站或服务中任何第三方的声明或行为;我们采取的任何行动或未能通过您发送给我们的通讯结果;人为错误;技术故障;失败，包括公共设施或电话故障;任何设备或网络，提供商或软件的疏忽，中断，延迟，删除或缺陷（包括但不限于，不允许参与本服务的参与者）;任何对计算机设备的伤害或损害;无法完全访问本网站或服务或任何其他网站;对任何形式的盗窃，篡改，毁坏或未经授权的访问，图像或其他内容;处理时间过晚或不正确或不完整或丢失的数据;排版，印刷或其他错误，或其任何组合;或与本网站或服务有关的任何其他事项。
          某些司法管辖区不允许排除某些担保或限制或排除对偶发或继发损害的责任。从而，上述某些限制可能不适用于您。
        </div>
      </div>
      <div class="item">
        <h1 class="title">7.我们的所有权</h1>
        <div class="content">本服务的称号，所有权和知识产权归Alchemint志愿者，关联公司或其许可人所有。 您承认并同意本服务包含受适用知识产权和其他法律保护的专有和机密信息。
          除非经关联公司明确授权，否则您同意不会复制，修改，租借，租赁，出借，出售，分发，施行，展示或创建本服务的衍生作品的部分或全部内容。
        </div>
      </div>
      <div class="item">
        <h1 class="title">8.链接</h1>
        <div class="content">
          本服务提供者或第三方可提供链接到其他全球资讯网或可探访的网站，应用程序或资源链接。由于Alchemint志愿者均无法控制此类网站，应用程序和资源，因此您确认并同意Alchemint志愿者或任何关联公司不对此类外部网站，应用程序或资源的可用性负责，同时不对此类网站或资源上的任何内容，广告，产品或其他材料负责。您进一步承认并同意Alchemint志愿者或任何关联公司不对因使用或依赖此类内容，货物或网站与资源所造成直接或间接的任何损害或损失负责或承担责任。
        </div>
      </div>
      <div class="item">
        <h1 class="title">9.终止和暂停</h1>
        <div class="content">
          如果您违反本条款的任何条款或条件，Alchemint可立即终止或暂停全部或部分服务以及您的SAR-C及SAR-B系统和软件的探访，恕不另行通知或承担任何责任。一旦您被终止探访，您将立即失去使用本服务的权利。
        </div>
        <div class="content">本条款的以下条款在本条款终止后仍然有效：责任赔偿; 免责声明; 责任限制; 我们的所有权; 链接; 终止; 没有第三方受益人; 具有约束力的仲裁和集体诉讼豁免; 综合信息。
        </div>
      </div>
      <div class="item">
        <h1 class="title">10.没有第三方受益人</h1>
        <div class="content">您同意，除非这些条款另有明确规定，否则本条款不应包含第三方受益人。
        </div>
      </div>
      <div class="item">
        <h1 class="title">11.版权侵权索赔的通知和程序</h1>
        <div class="content">如果您认为您的版权或您当事人的版权遭到侵犯，请提供一份概括以下信息的书面通知到（legal@Alchemint.io）：
        </div>
        <ul class="content">
          <li>被授权代表版权所有者或知识产权利益的人的电子或实体签名;</li>
          <li>您声称遭到侵权的受版权保护作品或知识产权的描述;</li>
          <li>描述您声称侵权的部分并给予内容在本服务中的位置;</li>
          <li>您的地址，电话号码和电子邮件地址;</li>
          <li>您出具的声明，确信有争议的内容未经版权所有者，其代理人或法律授权;</li>
          <li>您出具的声明，保证您通知中的信息是准确的，并且您是版权或知识产权所有者或被授权代表版权或知识产权所有者行事，如有虚假，愿接受法律处罚。</li>
        </ul>
      </div>
      <div class="item">
        <h1 class="title">12.仲裁和集体诉讼豁免</h1>
        <h2 class="sub-title">12.1 初步争议解决</h2>
        <div class="content">当任何一方提起仲裁的条件，双方同意应尽最大努力直接解决任何争议，索赔，质疑或分歧，并进行善意谈判。
        </div>
        <h2 class="sub-title">12.2约束仲裁</h2>
        <div class="content">
          如果我们无法通过善意谈判解决争议，您和我们同意，任何争议将依据美国仲裁协会关于消费者相关仲裁的规则，根据本协议产生的任何争议应最终以个人身份在具有约束力的仲裁中解决。您和Alchemint明确放弃陪审团的审判和参与集体诉讼或全班仲裁的权利。仲裁将由一名中立的仲裁员进行，并应在您居住的县或教区或双方同意的地点以英语进行。仲裁员可以授予有管辖权的法院可以给予的任何救济，包括经法律授权的律师费，仲裁决定可以在任何法院强制执行。根据您的要求，听证会可以亲自或通过电话进行，仲裁员可以提供简报提交和确定动议，无需口头听证。在执行本协议的任何诉讼或诉讼中，胜诉方有权获得费用和律师费。
        </div>
        <div class="content">如果仲裁员或仲裁管理员将对您征收申请费或其他管理费用，我们将根据您的要求向您报销此类费用或费用将超过您在其他情况下必须支付的费用或费用。 在法庭上。
          如果仲裁管理员的规则或适用法律要求，我们还将支付额外费用或费用。
          除上述规定外，每一方均应承担任何其他费用或花费，例如律师费。如果法院判定第12.2条的任何规定宣布为无效或不具备执行效力，那么此条款应从协议中剥离，而本第12.2节的其他部分仍然适用。
          无论如何，本协议的其他条款仍然具有全部效力。
        </div>
        <h2 class="sub-title">12.3适用法律</h2>
        <div class="content">对于任何不受仲裁的争议，您和Alchemint同意服从位于新加坡法院的个人和专属管辖权和地点。[受新加坡管辖]您进一步同意通过邮件接受过程服务，并在此放弃其他可用的管辖权和场地抗辩。
        </div>
        <div class="content">本条款以及您与Alchemint之间的关系应受新加坡[受新加坡管辖]法律管辖，但不考虑其法律冲突原则。
        </div>
      </div>
      <div class="item">
        <h1 class="title">13.综合信息</h1>
        <h2 class="sub-title">13.1整个协议</h2>
        <div class="content">
          这些条款（以及可能在本服务上公布的任何附加条款，规则和条件）构成与本服务有关的完整协议，并取代任何先前的口头或书面协议。如果这些条款与附加条款，规则和参与条件发生冲突，后者将优先于条款。
        </div>
        <h2 class="sub-title">13.2条款的弃权和可分割性</h2>
        <div class="content">
          任何实体未能运用或执行本条款的任何权利或规定并不构成对此类权利或规定的放弃。如果仲裁员或有管辖权的法院认定本条款的任何条款无效，则双方同意仲裁员或法院应努力实施该条款所反映的当事人的意图，以及其他条款。条款仍然完全有效。
        </div>
        <h2 class="sub-title">13.3 限制法规</h2>
        <div class="content">您同意，无论任何相反的法规或法律，使用服务或条款而引起或与之相关的任何索赔或诉讼必须在此类索赔或诉讼因由发生后一（1）年以内提出，否则将被永久禁止。
        </div>
        <h2 class="sub-title">13.4部分标题</h2>
        <div class="content">本条款中的章节标题仅为方便起见，不具有法律或合同效应。
        </div>
        <h2 class="sub-title">13.5通讯</h2>
        <div class="content">对服务有疑问，投诉或索赔的用户可以在上述和legal@Alchemint.io的相关联系信息与我们联系。
        </div>
      </div>
      <div class="item">
        <h1 class="title">14.禁止使用</h1>
        <div class="content">
          您不得使用本服务从事以下类别的活动（“禁止使用”）。下面列出的具有代表性例子，但并不是详尽列表。如果您不确定您对服务的使用是否涉及禁止使用条规，或对这些条规有疑问，请您通过legal@Alchemint.io与我们联系。打开使用此处提供的服务，即表示您确认
          您不会使用此服务执行以下任何操作：
        </div>
        <ul class="content">
          <li>非法活动：在任何相关国家管理的制裁计划活动，违反或协助违反任何法律，法令，条例或法规，包括但不限于美国财政部外国资产控制办公室（“OFAC“），或涉及任何非法活动的收益;发布，分发或传播任何非法材料或信息
          </li>
          <li>
            侵犯其他用户：干扰其他个人或实体探访或使用任何服务;诽谤，侵犯，勒索，骚扰，追踪，威胁或以其他方式触犯或侵犯他人的合法权利（例如但不限于隐私，公开和知识产权）;煽动，威胁，促进，促进或鼓励仇恨，种族歧视或对他人的暴力行为;未经适当同意，收集或以其他方式从本网站汇集有关他人的信息，包括但不限于电子邮件地址
          </li>
          <li>欺诈：用于欺骗Alchemint，SAR-C及SAR-B系统和软件用户或其他人的活动;提供任何虚假，不准确或误导性的信息。</li>
          <li>
            知识产权侵权：从事涉及侵犯或违反任何版权，商标，公开权或隐私权或任何其他法律所有权的项目的交易，包括但不限于销售，分发或探访假音乐，电影，软件或其他未经权利人授权材料;未经Alchemint明确同意或以损害Alchemint的方式使用Alchemint知识产权，名称或徽标，包括使用Alchemint贸易或服务商标;任何暗示Alchemint不真实认可或附属的行为。
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="sar-service-footer clearfix">
      <span class="last-modified">
        {{$i18n.locale==='zh'?'最后修订：2018年12月28日':'Last Revised: 3 December 2018'}}
      </span>
      <el-button class="accept-btn"
                 type="primary"
                 @click="acceptService">
        {{$i18n.locale==='zh'?'同意':'Accept'}}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SarService',
    data() {
      return {
        dialogVisible: true,
      }
    },
    methods: {
      acceptService() {
        this.dialogVisible = false;
        localStorage.setItem('readSarService', 'true');
      }
    }
  }
</script>


<style lang="scss">
  @import "../../assets/styles/var";

  .sar-service-modal {
    margin: 90px auto 0 !important;
    width: 1200px !important;
    padding: 0 110px 0 150px;
    .el-dialog__header {
      padding: 40px 0;
      .el-dialog__title {
        font-size: 30px;
        color: $--color-primary;
        font-weight: bold;
      }
    }
    .el-dialog__body {
      max-height: 420px;
      overflow-y: auto;
      padding: 0;
      .sar-service-content {
        margin-right: 40px;
      }
      .title {
        font-size: 16px;
        color: #334;
        margin: 20px 0 0 0;
      }
      .sub-title {
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
      }
      .content {
        margin-top: 10px;
        color: #667;
        line-height: 19px;
        text-align: justify;
      }
    }
    .el-dialog__footer {
      padding: 40px 0;
      .sar-service-footer {
        line-height: 32px;
        .last-modified {
          float: left;
          color: $--color-primary;
        }
        .accept-btn {
          float: right;
          height: 32px;
          line-height: 32px;
          width: 120px;
          text-align: center;
          padding: 0;
        }
      }
    }
  }
</style>
