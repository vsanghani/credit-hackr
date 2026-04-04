import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './LegalDocument.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header">
                    <Link to="/" className="legal-back">
                        <ArrowLeft size={18} aria-hidden />
                        Back to home
                    </Link>
                    <h1>Privacy Policy</h1>
                    <p className="legal-updated">Last updated: 4 April 2026</p>
                </div>
                <article className="legal-article">
                    <div className="legal-callout">
                        <strong>Summary.</strong> This policy describes how Credit Hackr collects, uses, stores, and
                        discloses personal information when you use our website and related services. We aim to handle
                        information in line with the Australian Privacy Act 1988 (Cth), including the Australian
                        Privacy Principles (APPs), where they apply.
                    </div>

                    <h2>1. Who we are</h2>
                    <p>
                        Credit Hackr (referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates an
                        informational website about Australian credit cards, including comparison-style content, tools,
                        and editorial material. The operator of the site may be an individual or a company identified on
                        the site or in correspondence with you. If you need the specific legal entity name for
                        compliance or legal notices, contact us using the details below.
                    </p>

                    <h2>2. Scope</h2>
                    <p>
                        This policy applies to personal information we collect through this website, any subdomains,
                        mobile experiences that mirror the site, and related communications (for example, email you send
                        us). It does not govern third-party websites, apps, or financial institutions you may visit
                        from links on our site; those services have their own privacy policies.
                    </p>

                    <h2>3. What we collect</h2>
                    <p>Depending on how you use the site, we may collect:</p>
                    <ul>
                        <li>
                            <strong>Technical and usage data:</strong> IP address, approximate location derived from IP,
                            browser type and version, device type, operating system, referring URLs, pages viewed, time
                            and date of access, and similar analytics or log data.
                        </li>
                        <li>
                            <strong>Cookies and similar technologies:</strong> identifiers stored on your device to
                            maintain preferences, measure traffic, and improve the service. See section 8.
                        </li>
                        <li>
                            <strong>Information you provide voluntarily:</strong> such as your name, email address, or
                            message content if you contact us or subscribe to updates (if offered).
                        </li>
                        <li>
                            <strong>Aggregated or de-identified data:</strong> that does not reasonably identify you,
                            used for analytics, reporting, and product improvement.
                        </li>
                    </ul>
                    <p>
                        We do not intentionally collect sensitive information (for example, health information) through
                        this site. Please do not send us sensitive information unless we explicitly request it for a
                        defined purpose.
                    </p>

                    <h2>4. How we collect</h2>
                    <p>We collect personal information:</p>
                    <ul>
                        <li>Directly from you when you submit forms, email us, or otherwise interact with us;</li>
                        <li>
                            Automatically when you use the site (for example, server logs, cookies, and analytics
                            tools); and
                        </li>
                        <li>
                            From third parties where permitted, such as analytics or infrastructure providers acting on
                            our behalf.
                        </li>
                    </ul>

                    <h2>5. Why we use your information</h2>
                    <p>We use personal information for purposes that are reasonably necessary for our functions, including to:</p>
                    <ul>
                        <li>Provide, operate, maintain, and improve the website and its features;</li>
                        <li>Understand how visitors use the site and measure performance and engagement;</li>
                        <li>Respond to enquiries and communicate with you;</li>
                        <li>Detect, prevent, or address technical issues, abuse, fraud, or security incidents;</li>
                        <li>Comply with legal obligations and enforce our terms; and</li>
                        <li>
                            Send marketing communications where permitted by law and, where required, with your consent
                            (you may opt out using instructions in the message or by contacting us).
                        </li>
                    </ul>

                    <h2>6. Legal bases (where relevant)</h2>
                    <p>
                        Where the Privacy Act applies, we generally rely on collecting and using information that is
                        reasonably necessary for our functions and activities, compatible secondary purposes where
                        permitted, or your consent where required. If other laws apply in specific contexts, we will
                        process information as allowed by those laws.
                    </p>

                    <h2>7. Disclosure of personal information</h2>
                    <p>We may disclose personal information to:</p>
                    <ul>
                        <li>
                            Service providers who assist us (for example, hosting, analytics, email delivery, security),
                            subject to confidentiality and data-handling terms;
                        </li>
                        <li>Professional advisers (for example, lawyers or accountants) when reasonably required;</li>
                        <li>Law enforcement, regulators, or other parties when required or permitted by law; and</li>
                        <li>
                            A buyer or successor in connection with a merger, acquisition, or sale of assets, where
                            personal information may transfer as part of the business.
                        </li>
                    </ul>
                    <p>
                        We do not sell your personal information in the conventional sense of selling lists of
                        individuals to unrelated marketers. If we use advertising or affiliate technology that involves
                        sharing identifiers with partners, we will describe that in this policy or in-product notices as
                        those features are enabled.
                    </p>

                    <h2>8. Overseas disclosure</h2>
                    <p>
                        Some of our service providers may store or process data outside Australia (for example, in the
                        United States, Europe, or the Asia-Pacific region). Where we disclose personal information
                        overseas, we take reasonable steps to ensure overseas recipients handle it in accordance with
                        the Privacy Act where required, except where an exception applies.
                    </p>

                    <h2>9. Cookies and analytics</h2>
                    <p>
                        We use cookies and similar technologies for essential site operation, preferences, and
                        analytics. You can control cookies through your browser settings; blocking some cookies may
                        affect site functionality. Our cookie banner (where shown) supplements this section.
                    </p>

                    <h2>10. Security</h2>
                    <p>
                        We implement reasonable technical and organisational measures designed to protect personal
                        information from misuse, interference, loss, and unauthorised access, modification, or
                        disclosure. No method of transmission over the internet is completely secure; we cannot guarantee
                        absolute security.
                    </p>

                    <h2>11. Retention</h2>
                    <p>
                        We retain personal information only for as long as reasonably necessary for the purposes
                        described in this policy, unless a longer period is required or permitted by law. When we no
                        longer need information, we take reasonable steps to destroy or de-identify it.
                    </p>

                    <h2>12. Access, correction, and complaints</h2>
                    <p>
                        Under the Privacy Act, you may request access to personal information we hold about you and ask
                        for corrections if it is inaccurate, out of date, incomplete, irrelevant, or misleading. To make
                        a request, contact us using the details below. We may need to verify your identity before
                        responding.
                    </p>
                    <p>
                        If you believe we have mishandled your personal information, please contact us first. If you
                        are not satisfied with our response, you may complain to the Office of the Australian
                        Information Commissioner (OAIC) at{' '}
                        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
                            www.oaic.gov.au
                        </a>
                        .
                    </p>

                    <h2>13. Notifiable Data Breaches</h2>
                    <p>
                        If we are required to comply with the Notifiable Data Breaches scheme under the Privacy Act, we
                        will assess eligible data breaches and, where mandatory, notify affected individuals and the
                        OAIC in accordance with applicable law.
                    </p>

                    <h2>14. Children</h2>
                    <p>
                        Our services are not directed at children under 16. We do not knowingly collect personal
                        information from children. If you believe we have collected information from a child, please
                        contact us and we will take steps to delete it where appropriate.
                    </p>

                    <h2>15. Changes to this policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top
                        will change when we publish revisions. Material changes may be highlighted on the site or via
                        other reasonable notice where appropriate. Continued use of the site after changes constitutes
                        your acknowledgement of the updated policy, to the extent permitted by law.
                    </p>

                    <h2>16. Contact</h2>
                    <p>
                        For privacy questions, access or correction requests, or complaints, contact us using the
                        contact or support options published on this website (for example, via the footer or contact
                        page). If no dedicated address is listed, you may reach the site operator through the same
                        channels used for general enquiries. Please also read our{' '}
                        <Link to="/terms">Terms of Use</Link>.
                    </p>
                </article>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
