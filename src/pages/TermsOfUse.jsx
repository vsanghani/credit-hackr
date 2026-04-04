import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './LegalDocument.css';

const TermsOfUse = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header">
                    <Link to="/" className="legal-back">
                        <ArrowLeft size={18} aria-hidden />
                        Back to home
                    </Link>
                    <h1>Terms of Use</h1>
                    <p className="legal-updated">Last updated: 4 April 2026</p>
                </div>
                <article className="legal-article">
                    <div className="legal-callout">
                        <strong>Important.</strong> These Terms of Use govern your access to and use of the Credit Hackr
                        website and related informational services. By using the site, you agree to these terms. The site
                        provides general information and comparison-style content only; it does not provide personal
                        financial product advice or credit recommendations tailored to your circumstances.
                    </div>

                    <h2>1. Agreement</h2>
                    <p>
                        By accessing or using Credit Hackr (&quot;Site&quot;, &quot;we&quot;, &quot;us&quot;), you agree
                        to be bound by these Terms of Use and our{' '}
                        <Link to="/privacy">Privacy Policy</Link>, which is incorporated by reference. If you do not
                        agree, do not use the Site.
                    </p>

                    <h2>2. Eligibility</h2>
                    <p>
                        You must be at least 18 years old to use this Site. By using the Site, you represent that you
                        meet this requirement. If you use the Site on behalf of an organisation, you represent that you
                        have authority to bind that organisation to these terms.
                    </p>

                    <h2>3. Nature of the service</h2>
                    <p>
                        Credit Hackr offers educational and informational content about Australian credit cards and
                        related topics, including calculators, summaries, and editorial articles. Features may change,
                        be suspended, or be discontinued without notice. We do not guarantee uninterrupted or error-free
                        operation.
                    </p>

                    <h2>4. Not financial product advice</h2>
                    <p>
                        Nothing on this Site is personal financial product advice, personal advice, or a recommendation
                        that you acquire, hold, or dispose of any financial product. We do not take into account your
                        objectives, financial situation, or needs. Before making any decision about a financial product,
                        consider the relevant product disclosure statement (PDS), target market determination (TMD), terms
                        and conditions, and other offer documentation from the issuer, and consider obtaining advice from
                        a licensed financial adviser where appropriate.
                    </p>

                    <h2>5. No offer of credit</h2>
                    <p>
                        Content on the Site does not constitute an offer or solicitation for credit. Any application,
                        approval, or decline is solely between you and the relevant issuer or lender. Display of a
                        product does not mean you are eligible or that terms shown will apply to you.
                    </p>

                    <h2>6. Accuracy and reliance</h2>
                    <p>
                        We strive to keep information accurate and current, but credit products, rates, fees, rewards
                        rules, and promotional terms change frequently. Information may be incomplete, summarised, or
                        outdated. You should verify all material details—including rates, fees, eligibility criteria,
                        and benefits—directly with the issuer before acting. Your use of information on the Site is at
                        your own risk.
                    </p>

                    <h2>7. Third-party products, links, and services</h2>
                    <p>
                        The Site may reference or link to third-party websites, issuers, advertisers, or partners.
                        We do not control and are not responsible for third-party content, products, policies, or
                        practices. Links are provided for convenience only and do not imply endorsement. When you leave
                        our Site, third-party terms and privacy policies apply.
                    </p>

                    <h2>8. Affiliate and commercial relationships</h2>
                    <p>
                        We may receive fees, commissions, or other benefits when you click certain links, apply for
                        products, or interact with featured offers (for example, through affiliate or referral
                        arrangements). Such arrangements may influence placement or prominence of content but do not
                        change the fact that content is general in nature and not personal advice. Where required by
                        law, we will disclose material commercial relationships clearly on the Site.
                    </p>

                    <h2>9. Acceptable use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Site in violation of law or third-party rights;</li>
                        <li>
                            Attempt to gain unauthorised access to our systems, other users&apos; data, or connected
                            networks;
                        </li>
                        <li>
                            Scrape, harvest, or automate access to the Site in a way that imposes an unreasonable load
                            or circumvents technical limits, except as allowed by robots.txt or express written
                            permission;
                        </li>
                        <li>Introduce malware or interfere with the proper working of the Site; or</li>
                        <li>Misrepresent your identity or affiliation.</li>
                    </ul>
                    <p>
                        We may suspend or terminate access if we reasonably believe you have breached these terms or
                        pose a risk to the Site or others.
                    </p>

                    <h2>10. Intellectual property</h2>
                    <p>
                        The Site and its content (including text, graphics, logos, layout, and software) are owned by us
                        or our licensors and are protected by intellectual property laws. You may view and print
                        reasonable portions for personal, non-commercial use. You must not copy, modify, distribute,
                        sell, or create derivative works from the Site or our branding without prior written consent,
                        except as allowed by applicable law.
                    </p>

                    <h2>11. User content</h2>
                    <p>
                        If you submit comments, feedback, or other content to us, you grant us a non-exclusive,
                        royalty-free, worldwide licence to use, reproduce, modify, and display that content for the
                        purpose of operating and improving the Site, unless we agree otherwise in writing. You warrant
                        that you have the rights to grant this licence and that your content does not infringe others
                        or violate law.
                    </p>

                    <h2>12. Disclaimers</h2>
                    <p>
                        To the maximum extent permitted by the Australian Consumer Law and other applicable law, the
                        Site and all content are provided on an &quot;as is&quot; and &quot;as available&quot; basis
                        without warranties of any kind, whether express, implied, or statutory, including implied
                        warranties of merchantability, fitness for a particular purpose, and non-infringement. Nothing
                        on the Site is a promise of any particular outcome, approval, savings, or reward value.
                    </p>
                    <p>
                        Certain legislation implies guarantees or warranties that cannot be excluded. Where those laws
                        apply, our liability is limited to the extent permitted—for example, to resupplying the services
                        or paying the cost of resupply.
                    </p>

                    <h2>13. Limitation of liability</h2>
                    <p>
                        To the maximum extent permitted by law, we (and our directors, officers, employees, contractors,
                        and affiliates) are not liable for any indirect, incidental, special, consequential, or punitive
                        damages, or for loss of profits, revenue, data, goodwill, or opportunity, arising from or related
                        to your use of or inability to use the Site or reliance on its content, even if we have been
                        advised of the possibility of such damages.
                    </p>
                    <p>
                        To the maximum extent permitted by law, our aggregate liability for any claim arising out of or
                        related to the Site or these terms is limited to the greater of (a) AUD $100 or (b) the amounts
                        you paid us (if any) for use of the Site in the twelve months before the claim. Some
                        jurisdictions do not allow certain limitations; in those cases, our liability is limited to the
                        fullest extent still permitted.
                    </p>

                    <h2>14. Indemnity</h2>
                    <p>
                        You agree to indemnify and hold harmless Credit Hackr and its operators, affiliates, and
                        personnel from claims, damages, losses, liabilities, and expenses (including reasonable legal
                        fees) arising from your use of the Site, your breach of these terms, or your violation of law or
                        third-party rights, except to the extent caused by our gross negligence or wilful misconduct.
                    </p>

                    <h2>15. Changes</h2>
                    <p>
                        We may modify these Terms of Use at any time. We will publish the updated terms on the Site and
                        update the &quot;Last updated&quot; date. Your continued use after changes become effective
                        constitutes your acceptance of the revised terms, except where prohibited by law. If you do not
                        agree, you must stop using the Site.
                    </p>

                    <h2>16. General</h2>
                    <p>
                        If any provision is held invalid or unenforceable, the remaining provisions remain in effect.
                        Failure to enforce a provision is not a waiver. These terms are governed by the laws of
                        Australia. You submit to the non-exclusive jurisdiction of the courts of Australia, subject to
                        any mandatory consumer protections where you reside.
                    </p>

                    <h2>17. Contact</h2>
                    <p>
                        For questions about these Terms of Use, contact us using the contact or support options
                        published on this website.
                    </p>
                </article>
            </div>
        </div>
    );
};

export default TermsOfUse;
