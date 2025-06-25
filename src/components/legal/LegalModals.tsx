
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, Info } from "lucide-react";

interface LegalModalsProps {
  children?: React.ReactNode;
}

export function AboutModal({ children }: LegalModalsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <button className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center">
            <Info className="w-3 h-3 mr-1" />
            About
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About BLACKLABEL.gg
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-white/90">
            {/* About Section */}
            <section className="space-y-4">
              <p className="text-base text-white/95">
                BLACKLABEL.gg is an invite-only platform built for the best in games.
              </p>
              <p>
                We connect world-class creative and technical talent with studios and projects that demand excellence.
              </p>
              <p>
                Born from decades of industry experience—and frustration with how fragmented, noisy, and impersonal hiring pipelines have become—BLACKLABEL.gg was created as an alternative: a high-trust network where credibility, craft, and character come first.
              </p>
              <p>
                Whether you're a veteran creative director seeking your next mission, or a studio looking to bring on elite collaborators for a tight timeline or stealth initiative, this is the space where quiet excellence thrives.
              </p>
              <p className="font-medium text-white">
                Just the right people. At the right time. For the right work.
              </p>
              <p className="font-medium text-primary">
                All killer. No filler.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    What makes BLACKLABEL.gg different from other gig platforms?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">
                      Unlike open marketplaces, BLACKLABEL.gg is a curated network. Every member—whether a seeker or poster—is vetted and invited. This ensures a higher signal-to-noise ratio, deeper trust, and more meaningful opportunities.
                    </p>
                    <p className="font-medium">
                      We're not here to commoditize talent—we're here to respect it.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    How do I get invited?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">There are two paths:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                      <li>Direct invitation from an existing member (each gets 3).</li>
                      <li>Manual application reviewed by our team of industry veterans.</li>
                    </ul>
                    <p>
                      If you're exceptional at what you do and serious about contributing meaningfully to game development, there's a path here for you.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    Who is this platform for?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">BLACKLABEL.gg is for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                      <li><strong>Gig Seekers:</strong> Senior- to principal-level creatives and technologists across design, engineering, art, production, audio, community, and strategy.</li>
                      <li><strong>Gig Posters:</strong> Studios, publishers, or teams who value quality over quantity—and are ready to pay for experience.</li>
                    </ul>
                    <p>
                      We're intentionally focused on veterans and high-trust collaborators. This isn't a beginner's marketplace.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    What kinds of gigs are posted?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">Gigs vary from:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                      <li>Short-term consultations (e.g., "We need a combat designer to gut-check our boss flow")</li>
                      <li>Freelance contracts (e.g., "2-month stint for an Unreal Tech Artist")</li>
                      <li>Stealth startup collabs or moonlighting</li>
                      <li>Full-time roles posted discreetly</li>
                    </ul>
                    <p>
                      Compensation is always disclosed or estimable before you engage.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    Is there a fee to use BLACKLABEL.gg?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">Talent never pays to use the platform.</p>
                    <p className="mb-3">
                      Gig Posters pay a finder's fee based on the total budget of a gig (details available on request).
                    </p>
                    <p>
                      All terms are clear and up-front—no surprise fees, no fine print.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    Is my profile public?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p>
                      No. Profiles are only visible to approved users of the platform and are not indexed publicly. You control what's shown.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    Can I invite others?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p>
                      If you're a member, you'll be granted 3 invites to extend to professionals you trust. Choose carefully—your credibility travels with them.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    How can I get in touch?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p>
                      For support, partnership, or media inquiries, contact us at <a href="mailto:support@blacklabel.gg" className="text-primary hover:underline">support@blacklabel.gg</a>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyPolicyModal({ children }: LegalModalsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <button className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Privacy Policy
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            BLACKLABEL.gg – Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Last Updated: June 24, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-white/90">
            <p className="text-muted-foreground">
              Welcome to BLACKLABEL.gg. We take your privacy seriously—after all, trust is everything in an invite-only network of elite creators.
            </p>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">1. What We Collect (and Why)</h3>
              <p className="mb-3">We collect personal data to make BLACKLABEL.gg work as intended:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Info:</strong> Name, email address, display name, role (e.g. Studio, Talent, Admin)</li>
                <li><strong>Profile Content:</strong> Bio, professional history, portfolio links, and endorsements</li>
                <li><strong>Activity:</strong> Project applications, messages, referrals, and invites</li>
                <li><strong>Device & Usage Data:</strong> IP address, browser type, and activity logs (for security and analytics)</li>
              </ul>
              <p className="mt-3 font-medium text-primary">We do not sell or rent your personal data. Ever.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">2. How We Use Your Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>To run the platform:</strong> Manage accounts, enable networking, and deliver features</li>
                <li><strong>To improve BLACKLABEL:</strong> Track bugs, analyze usage, and optimize the experience</li>
                <li><strong>To communicate with you:</strong> Transactional emails, platform updates, and support</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">3. Who Can See What</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Public-facing data:</strong> Display name, bio, role, and selected work samples (if published)</li>
                <li><strong>Private data:</strong> Email address, activity logs, and internal notes are visible only to you and BLACKLABEL admins</li>
              </ul>
              <p className="mt-3">We never show or share private data unless:</p>
              <ul className="list-disc list-inside space-y-1 ml-8 mt-2">
                <li>You consent explicitly</li>
                <li>It's legally required</li>
                <li>We're protecting the rights, property, or safety of BLACKLABEL or others</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">4. Cookies & Tracking</h3>
              <p className="mb-2">We use minimal cookies for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Session management</li>
                <li>Security</li>
                <li>Usage analytics</li>
              </ul>
              <p className="mt-3">We don't use third-party trackers or ads.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">5. Data Retention</h3>
              <p>We retain data as long as your account is active or as needed to provide services. You may request deletion at any time.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">6. Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account</li>
                <li>Request a copy of your data</li>
              </ul>
              <p className="mt-3">To exercise these rights, email us at <a href="mailto:hello@blacklabel.gg" className="text-primary hover:underline">hello@blacklabel.gg</a></p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">7. Changes</h3>
              <p>We may update this policy. We'll notify you if we make any material changes.</p>
            </section>

            <section className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">📬 Contact Us</h3>
              <p>If you have questions about this policy or need support, reach out at <a href="mailto:hello@blacklabel.gg" className="text-primary hover:underline">hello@blacklabel.gg</a></p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsOfServiceModal({ children }: LegalModalsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <button className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            Terms of Service
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            BLACKLABEL.gg – Terms of Service
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Last Updated: June 24, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-white/90">
            <p className="text-muted-foreground">
              By accessing or using BLACKLABEL.gg, you agree to these Terms.
            </p>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">1. Who Can Use BLACKLABEL.gg</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You must be 18 or older</li>
                <li>You must be invited or approved by an admin</li>
                <li>You must use the platform for professional purposes only</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">2. Your Account</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You're responsible for keeping your login credentials secure</li>
                <li>You agree not to impersonate others or misrepresent your credentials</li>
                <li>We may suspend or terminate accounts for misuse, fraud, or violations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">3. Platform Conduct</h3>
              <p className="mb-2">By using BLACKLABEL.gg, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Be respectful:</strong> No harassment, hate speech, or spam</li>
                <li><strong>Be truthful:</strong> Showcase only work and experience that is your own</li>
                <li><strong>Use your invites wisely:</strong> Invite people who embody the platform's professional standards</li>
              </ul>
              <p className="mt-3">We reserve the right to revoke access at any time to preserve platform integrity.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">4. Intellectual Property</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You retain ownership of content you submit</li>
                <li>By uploading, you grant us a license to display and promote it on BLACKLABEL.gg</li>
                <li>You may not copy, distribute, or reverse-engineer any part of our platform</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">5. Fees and Payments</h3>
              <p>If we introduce premium services or finder's fees, they'll be clearly disclosed before you opt in. All payments are final unless otherwise stated.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">6. Limitation of Liability</h3>
              <p className="mb-2">BLACKLABEL.gg is offered "as is." We are not liable for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Missed opportunities</li>
                <li>Decisions made based on platform content</li>
                <li>Downtime, bugs, or other technical issues</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">7. Termination</h3>
              <p>You can delete your account anytime. We may suspend or terminate access if you violate these terms or put the platform at risk.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">8. Changes to These Terms</h3>
              <p>We may update these Terms from time to time. Continued use of the platform after changes means you accept them.</p>
            </section>

            <section className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">📬 Contact Us</h3>
              <p>If you have questions about this policy or need support, reach out at <a href="mailto:hello@blacklabel.gg" className="text-primary hover:underline">hello@blacklabel.gg</a></p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
