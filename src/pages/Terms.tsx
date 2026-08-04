import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const sections: { title: string; blocks: (string | { sub: string; items?: string[]; text?: string })[] }[] = [
  {
    title: "1. Description of Service",
    blocks: [
      "Hiravel is a comprehensive AI-powered HR and recruitment platform designed exclusively for businesses. The Service provides your Company with the following capabilities:",
      { sub: "", items: [
        "Recruitment: Post job opportunities and leverage our AI matching system to identify the most suitable candidates from submitted profiles.",
        "HR Management: Manage your workforce, assign tasks, track performance, and oversee employee productivity.",
        "Payroll Processing: Handle compensation, run payroll, and manage employee payments through the platform.",
        "Advertising: Run targeted advertisements through our platform to promote your brand or job openings.",
        "Analytics: Access data-driven insights and reports regarding your hiring and HR operations.",
      ]},
      "Hiravel acts as a software tool and facilitator. We are not a recruitment agency, employer of record, or party to any employment contract entered into between your Company and any workers or candidates sourced through the platform. All ultimate hiring, employment, and compensation decisions remain your responsibility, but we commit to providing a reliable and accurate platform to support those decisions.",
    ],
  },
  {
    title: "2. Account Registration and Eligibility",
    blocks: [
      "The Service is intended for use by businesses and their authorized representatives. By registering, you confirm that you are accessing the platform on behalf of a legitimate business entity and that you are legally authorized to bind that entity.",
      "Your Company agrees to:",
      { sub: "", items: [
        "Provide accurate, complete, and current information during registration and keep it updated;",
        "Maintain the confidentiality of your login credentials. You are fully responsible for all activity that occurs under your Company's account;",
        "Notify us immediately if you suspect unauthorized access to your account;",
        "Not create multiple accounts or impersonate another business entity.",
      ]},
      "We reserve the right to suspend, terminate, or restrict accounts that contain false information, violate these Terms, or engage in fraudulent or abusive behavior. We will provide notice and an opportunity to remedy the issue where reasonably possible.",
    ],
  },
  {
    title: "3. Use of the Service",
    blocks: [
      { sub: "3.1 License Grant", text: "We grant your Company a non-exclusive, non-transferable, limited license to use the Service for your internal business purposes, subject to these Terms. You may not resell, sublicense, or distribute the Service without our prior written consent." },
      { sub: "3.2 Compliance with Laws", text: "You are solely responsible for ensuring that your use of the Service complies with all applicable laws, rules, and regulations, including but not limited to employment laws, data protection laws, anti-discrimination laws, tax laws, and payroll regulations. We provide tools to help you comply, but we do not provide legal advice." },
      { sub: "3.3 Your Obligations as a Company", text: "When using Hiravel, your Company agrees to:" },
      { sub: "", items: [
        "Accurate Job Postings: All job listings must be accurate, genuine, and compliant with applicable employment laws. You may not post fake, misleading, or discriminatory job offers.",
        "Non-Discrimination: You must not use the platform to discriminate against candidates or employees on the basis of age, race, gender, sexual orientation, disability, religion, nationality, or any other protected characteristic. All hiring and management decisions must be based on legitimate professional qualifications and job requirements.",
        "Data Usage: Any candidate, employee, or worker data accessed through Hiravel may only be used for legitimate hiring, HR management, payroll, and task management purposes directly related to your business operations. You may not export, scrape, store, or use this data for any purpose unrelated to the specific job opening or HR function, nor may you contact individuals through external channels without their explicit consent.",
        "Platform Use: Initial contact, application review, and core communications should be conducted through Hiravel's platform. Attempting to circumvent the platform to avoid fees or obligations is a material violation of these Terms.",
      ]},
    ],
  },
  {
    title: "4. AI Matching System",
    blocks: [
      "Our proprietary AI matching system analyzes candidate profiles and your job requirements to suggest suitable matches. You acknowledge and agree that:",
      { sub: "", items: [
        "The AI matching system provides data-driven recommendations, not guarantees. However, we are committed to continuously improving the accuracy and reliability of our matching algorithms;",
        "We are transparent about the factors that influence our matching logic and provide explanations for AI-generated recommendations where feasible;",
        "The accuracy of any match depends on the completeness and accuracy of the information you provide and the information submitted by candidates. We provide data validation tools to help you verify information;",
        "We reserve the right to use aggregated and anonymized data from your use of the platform to train, enhance, and improve our AI algorithms. Identifiable company and employee data is never used for public AI training without explicit consent.",
      ]},
      "Our Commitment: If you identify a significant, demonstrable error in our AI matching system that materially affects your recruitment outcomes, we will investigate promptly and work to correct it. If the error is on our end, we will not charge you for the affected service period.",
    ],
  },
  {
    title: "5. User Content and Intellectual Property",
    blocks: [
      { sub: "5.1 Ownership", text: "Your Company retains full ownership of all content you submit to Hiravel, including job postings, company descriptions, task assignments, and payroll data. By submitting content, you grant Keatek a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and modify your content solely to operate, maintain, and improve the platform for your benefit." },
      { sub: "5.2 Your Representations", text: "You are solely responsible for all content you submit. You represent and warrant that:" },
      { sub: "", items: [
        "You own or have the right to use the content you submit;",
        "Your content does not infringe any third-party intellectual property rights;",
        "Your content does not contain defamatory, obscene, unlawful, or harmful material;",
        "You have obtained all necessary consents from your employees or candidates to submit their data to our platform.",
      ]},
      { sub: "5.3 Hiravel Intellectual Property", text: "The Hiravel platform, including its design, source code, features, logo, branding, AI algorithms, and all original content created by Keatek, is owned by Keatek and protected by copyright, trademark, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, lease, reverse engineer, decompile, or attempt to extract the source code of our software, nor may you use our platform to build a competitive product or service." },
    ],
  },
  {
    title: "6. Payment Terms",
    blocks: [
      "Certain features of Hiravel, including advanced recruitment tools, payroll processing, and advertising, are available on a paid subscription or usage basis. By subscribing to a paid plan, your Company agrees that:",
      { sub: "", items: [
        "You authorize Keatek to charge your designated payment method on the applicable billing cycle;",
        "All subscription fees are non-refundable unless we materially fail to provide the Service as described;",
        "Prices may change with 30 days' written notice. Your continued use of the Service after a price change constitutes your acceptance of the new pricing;",
        "If any payment fails, we may suspend access to premium features and services until the outstanding balance is resolved. We will notify you in advance and work with you to resolve payment issues before suspending service.",
      ]},
      "Service Credits: If we experience a service outage that is our fault and that materially affects your ability to use the platform for more than 48 consecutive hours, we will issue a pro-rata service credit for the affected period.",
    ],
  },
  {
    title: "7. Service Availability and Performance",
    blocks: [
      { sub: "7.1 Uptime Commitment", text: "We are committed to keeping Hiravel available and reliable. We target 99.5% uptime on a monthly basis, excluding scheduled maintenance (which we will notify you of at least 48 hours in advance)." },
      { sub: "7.2 Support", text: "We provide technical support via email and in-app channels during business hours. Critical issues affecting core functionality receive priority response." },
      { sub: "7.3 Third-Party Dependencies", text: "Some features of Hiravel depend on third-party services (such as payment processors, cloud providers, or communication APIs). While we take reasonable steps to ensure these services are reliable, we cannot be held responsible for failures originating from third-party providers beyond our reasonable control." },
    ],
  },
  {
    title: "8. Data Privacy and Protection",
    blocks: [
      { sub: "8.1 Privacy Policy", text: "Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Your Company should make our Privacy Policy available to any employees, candidates, or workers whose personal data you submit to the platform." },
      { sub: "8.2 Data Processing Roles", text: "Where Keatek processes personal data (such as employee or candidate information) on behalf of your Company, we act as a data processor and your Company acts as the data controller. This means:" },
      { sub: "", items: [
        "You are responsible for having a lawful basis to process the personal data you submit, ensuring its accuracy, and fulfilling data subject rights requests;",
        "We are responsible for processing that data only according to your instructions, maintaining appropriate security measures, and notifying you promptly if we become aware of any data breach affecting your data.",
      ]},
      { sub: "8.3 Data Security", text: "We implement and maintain industry-standard security measures, including encryption at rest and in transit, access controls, regular security audits, and employee training, to protect your data. In the event of a data breach affecting your Company, we will notify you within 48 hours of confirmation, provide regular updates on our investigation and remediation efforts, and work with you to fulfill any legal notification obligations to affected employees or candidates." },
      { sub: "8.4 Data Sharing with Authorities", text: "Notwithstanding any other provision of these Terms, Keatek reserves the right to disclose your Company's data, including employee information, payroll records, and communications, to law enforcement authorities and government agencies only in the following circumstances:" },
      { sub: "", items: [
        "When required by a valid court order, subpoena, or legal process;",
        "When responding to lawful government or regulatory requests;",
        "When we reasonably believe that disclosure is necessary to protect public safety, national security, or to assist in emergency situations involving imminent threat to life or property;",
        "To detect, prevent, or address fraud, security threats, or technical issues;",
        "To protect the rights, property, or safety of Keatek, our users, or the public.",
      ]},
      "In all such cases, Keatek will limit disclosure to the specific data requested and only to the relevant authorities; we will notify your Company of such disclosures unless prohibited by law or where notification would compromise the purpose of the investigation; and we will challenge overly broad or inappropriate requests where legally permissible.",
    ],
  },
  {
    title: "9. Data Retention and Deletion",
    blocks: [
      "Keatek will retain your Company's data only as long as necessary to fulfill business purposes or comply with legal obligations.",
      { sub: "Retention Periods", items: [
        "Active Account Data: Retained while your account is active and subscription is current;",
        "Job Postings: Retained for 2 years after the posting is closed or filled;",
        "Employee/Worker Data: Retained as long as you maintain them in your HR system and for a reasonable period thereafter, subject to your instructions;",
        "Payroll and Financial Records: Retained for 7 years to comply with tax and financial regulations;",
        "Billing Records: Retained for 7 years;",
        "Analytics and AI Training Data: Aggregated and anonymized data may be retained indefinitely; identifiable data is deleted or anonymized within 2 years.",
      ]},
      "Our Commitment: Upon your request, we will delete your Company's data within 60 days, subject to legal retention requirements. We will provide you with a data export in a machine-readable format before deletion.",
    ],
  },
  {
    title: "10. Security Incident Notification",
    blocks: [
      "In the event of a security breach that affects your Company's data, Keatek will:",
      { sub: "", items: [
        "Notify your designated account administrator within 48 hours of confirmation;",
        "Immediately assess the scope and impact of the breach;",
        "Implement containment measures and conduct a thorough investigation;",
        "Provide regular updates on remediation efforts;",
        "Assist your Company in fulfilling any legal notification obligations to affected employees or candidates;",
        "Cover reasonable costs associated with mandatory breach notifications required by law, where the breach is caused by our negligence.",
      ]},
      "We will not disclose the specifics of our security measures to unauthorized parties but will provide sufficient detail to allow your Company to understand the nature and impact of the incident.",
    ],
  },
  {
    title: "11. Prohibited Uses",
    blocks: [
      "Your Company may not use Hiravel to:",
      { sub: "", items: [
        "Post fake, fraudulent, or deceptive job listings or business information;",
        "Scrape, harvest, or extract user or candidate data from the platform without explicit authorization;",
        "Send unsolicited commercial messages (spam) to candidates or other users;",
        "Attempt to reverse-engineer, decompile, or access non-public parts of our systems;",
        "Upload malware, viruses, ransomware, or any malicious code;",
        "Interfere with or disrupt the integrity, performance, or security of the platform;",
        "Attempt to gain unauthorized access to another user's account;",
        "Violate any applicable local, national, or international law or regulation;",
        "Engage in any discriminatory, harassing, or abusive behavior toward candidates or employees;",
        "Use the platform to manage or pay workers in violation of minimum wage, overtime, or employment classification laws.",
      ]},
    ],
  },
  {
    title: "12. Disclaimers and Acknowledgments",
    blocks: [
      { sub: "12.1 What We Are Responsible For", items: [
        "Providing the platform as described, with reasonable care and skill;",
        "Maintaining the security and integrity of the platform and your data;",
        "Ensuring the platform operates substantially as described in our documentation;",
        "Promptly addressing and fixing bugs, errors, and performance issues that are within our control;",
        "Providing clear and timely communication about platform changes, maintenance, and issues.",
      ]},
      { sub: "12.2 What We Are Not Responsible For", items: [
        "The ultimate success, quality, or outcome of any hiring, management, or payroll decisions made using the platform. These decisions remain your responsibility as the employer;",
        "The conduct, qualifications, or performance of any candidates or workers sourced through the platform, except where we have misrepresented information we provided;",
        "Any losses arising from your reliance on the platform without independently verifying critical information;",
        "Any third-party services not operated by us, even if integrated with our platform;",
        "Any losses that are not a foreseeable consequence of our breach of these Terms.",
      ]},
      { sub: "12.3 Platform Availability", text: "We provide the platform \"as is\" and \"as available,\" but we are committed to keeping it operational and reliable. We do not guarantee that the platform will be completely uninterrupted or error-free, but we will take reasonable steps to minimize disruptions and fix issues promptly." },
    ],
  },
  {
    title: "13. Limitation of Liability",
    blocks: [
      { sub: "13.1 Fair and Balanced Liability", text: "Both parties agree that liability should be allocated fairly based on who is responsible for any loss or damage. To the maximum extent permitted by applicable law, Keatek shall be liable to your Company for any direct damages caused by our material breach of these Terms, gross negligence, or willful misconduct; any losses arising from a data breach caused by our failure to maintain reasonable security measures; and any losses arising from our failure to provide the platform as described. We do not exclude or limit our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any liability that cannot be excluded or limited under applicable law." },
      { sub: "Limitation Cap", text: "In all other cases, our total aggregate liability to your Company shall not exceed the total amount paid by your Company to Keatek in the 12 months preceding the claim, or €5,000, whichever is greater." },
      { sub: "13.2 Your Company's Liability", items: [
        "Any direct damages caused by your material breach of these Terms;",
        "Any losses arising from your failure to comply with applicable laws;",
        "Any fines, penalties, or legal costs imposed on us due to your misuse of the platform;",
        "Any claims from your employees, candidates, or third parties arising from your actions.",
      ]},
      { sub: "13.3 Shared Responsibility", text: "In cases where both parties contribute to a loss, liability shall be apportioned based on the respective degree of fault." },
      { sub: "13.4 No Exclusion of Key Protections", text: "Nothing in these Terms excludes or limits either party's liability for breach of confidentiality or data protection obligations, infringement of intellectual property rights, or willful misconduct or gross negligence." },
    ],
  },
  {
    title: "14. Indemnification",
    blocks: [
      { sub: "By Your Company", text: "Your Company agrees to defend, indemnify, and hold harmless Keatek and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising out of or relating to:" },
      { sub: "", items: [
        "Your Company's use of Hiravel in violation of these Terms;",
        "Any content your Company submits to the platform;",
        "Any employment, contract, wage, discrimination, or labor disputes between your Company and your workers, employees, or candidates;",
        "Your Company's violation of any third-party rights, including intellectual property rights;",
        "Your Company's violation of any applicable laws, regulations, or industry standards.",
      ]},
      { sub: "By Keatek", text: "Keatek agrees to defend, indemnify, and hold harmless your Company from any claims arising out of our infringement of third-party intellectual property rights with respect to the platform itself, or our gross negligence or willful misconduct in providing the Service." },
    ],
  },
  {
    title: "15. Termination",
    blocks: [
      { sub: "By Your Company", text: "You may close your account at any time from your account settings or by contacting us. Upon closure, your public job postings and company profile will be removed. We will provide a data export in a machine-readable format before permanent deletion." },
      { sub: "By Keatek", items: [
        "Material Breach: If you materially violate these Terms and fail to remedy the breach within 15 days of written notice;",
        "Immediate Termination: If you engage in fraudulent, illegal, or abusive behavior that poses a risk to the platform or other users;",
        "Non-Payment: If your account is delinquent on payments beyond 30 days, after reasonable notice and opportunity to pay.",
      ]},
      "Upon termination, your right to use the platform ceases; we will provide a 30-day period (or as required by law) to export your data; and provisions that by their nature should survive termination will remain in effect.",
    ],
  },
  {
    title: "16. Governing Law and Dispute Resolution",
    blocks: [
      "These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law provisions.",
      { sub: "Dispute Resolution Process", items: [
        "Informal Resolution: Both parties agree to first attempt to resolve any dispute amicably through good-faith negotiations. A written description of the dispute and proposed resolution must be provided to the other party.",
        "Mediation: If negotiations fail within 30 days, the parties agree to attempt mediation with a mutually agreed-upon mediator.",
        "Arbitration or Litigation: If mediation fails, disputes shall be resolved through binding arbitration or the courts of the applicable jurisdiction. Both parties waive the right to a jury trial and agree that any dispute shall be brought in the individual capacity of the parties, not as a class action or representative proceeding.",
      ]},
      "Emergency Relief: Nothing in this section prevents either party from seeking urgent injunctive relief from a court to prevent irreparable harm.",
    ],
  },
  {
    title: "17. General Provisions",
    blocks: [
      { sub: "17.1 Entire Agreement", text: "These Terms constitute the entire agreement between your Company and Keatek regarding the Service and supersede all prior agreements, representations, and understandings." },
      { sub: "17.2 Amendments", text: "We reserve the right to modify these Terms at any time. Changes will be effective upon posting the revised Terms on our website with an updated \"Last Updated\" date. We will notify your Company of significant changes via email or platform notification at least 15 days before they take effect. Your continued use of the Service after such changes constitutes acceptance of the modified Terms. If you do not agree, you may terminate your account before the changes take effect." },
      { sub: "17.3 Severability", text: "If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect." },
      { sub: "17.4 Waiver", text: "Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision in the future." },
      { sub: "17.5 Assignment", text: "Your Company may not assign these Terms or your rights hereunder without our prior written consent. We may assign these Terms at any time without notice in connection with a merger, acquisition, or sale of assets, provided that your rights under these Terms are not materially diminished." },
      { sub: "17.6 No Partnership", text: "Nothing in these Terms creates a partnership, joint venture, agency, franchise, or employment relationship between your Company and Keatech." },
    ],
  },
];

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="font-display text-lg font-bold tracking-tight"
          >
            Hira<span className="text-primary">vel</span>
          </button>
        </div>
      </header>

      <main className="container max-w-3xl py-12">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Terms and Conditions for Hiravel
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last Updated: 15 August 2026</p>

        <div className="mt-8 border border-border bg-muted/40 p-6">
          <p className="font-display text-lg font-semibold">Welcome to Hiravel!</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            These Terms and Conditions ("Terms", "Terms and Conditions") constitute a legally binding
            agreement between your company or organization ("Company", "you", "your") and Keatek ("we",
            "us", "our"), the parent company of Hiravel. These Terms govern your Company's access to and
            use of the Hiravel platform, website, and all related services (collectively, the "Service").
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            By registering for an account, posting a job, using our AI matching features, managing workers,
            processing payroll, running advertisements, or otherwise using the Service, your Company confirms that:
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {[
              "You are a legally registered business entity or authorized to act on behalf of one;",
              "You have the legal capacity and authority to bind your Company to this agreement;",
              "You have read, understood, and agree to be bound by these Terms and our Privacy Policy.",
            ].map((i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If you do not agree with any part of these Terms, your Company may not use the Service.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="border-b border-border pb-3 font-display text-xl font-bold tracking-tight">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, i) =>
                  typeof block === "string" ? (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                      {block}
                    </p>
                  ) : (
                    <div key={i} className="space-y-2">
                      {block.sub && (
                        <h3 className="text-sm font-semibold text-foreground">{block.sub}</h3>
                      )}
                      {block.text && (
                        <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>
                      )}
                      {block.items && (
                        <ul className="space-y-2">
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground/70">
          © 2026 Keatek. Hiravel is a product of Keatek. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default Terms;
