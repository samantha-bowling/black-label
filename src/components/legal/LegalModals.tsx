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
              <p className="text-base text-white/95 font-medium">
                BLACKLABEL.gg is the invite-only talent platform where gaming's best connect with opportunities that matter.
              </p>
              <p>
                We're not just another job board. We're a curated network of verified gaming professionals—from seasoned art directors and technical leads to battle-tested producers and creative visionaries—all connected through a system built on trust and proven expertise.
              </p>
              <p>
                Whether you're a studio seeking a combat designer who can nail your boss encounters, a publisher looking for a UX expert to polish your mobile game, or an indie team needing a technical artist for that critical milestone, BLACKLABEL.gg connects you with talent that delivers.
              </p>
              <p>
                Our platform serves two distinct communities: <strong>Talent Seekers</strong> (verified gaming professionals) who join by invitation to access exclusive opportunities, and <strong>Gig Posters</strong> (studios, publishers, and teams) who can sign up to post projects and find the exact expertise they need.
              </p>
              <p className="font-medium text-white">
                Every profile is verified. Every opportunity is real. Every connection has purpose.
              </p>
              <p className="font-medium text-primary">
                This is where credibility meets craft.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    For Talent: How do I join as a gaming professional?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">
                      Joining as talent requires an invitation from an existing member or approval from our team. If you receive an invite token, simply use it during signup to create your verified profile.
                    </p>
                    <p className="mb-3">
                      Once you're in, you'll complete a professional onboarding process where you showcase your expertise, previous work, and areas of specialization. This helps us match you with the right opportunities.
                    </p>
                    <p className="font-medium">
                      No fees, no gimmicks—just access to quality gigs from real studios and teams.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    For Studios: How do I post gigs and find talent?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">
                      Studios, publishers, and teams can sign up directly to post gigs. Our onboarding process helps you create detailed project postings that attract the right talent.
                    </p>
                    <p className="mb-3">
                      You'll have access to our curated network of verified professionals across all gaming disciplines—from technical roles like programming and technical art to creative positions in design, audio, and production.
                    </p>
                    <p>
                      We operate on a transparent fee structure where you only pay when you successfully connect with talent through our platform.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    What types of gaming professionals are on the platform?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">Our network includes senior-level professionals across:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                      <li><strong>Design:</strong> Game designers, level designers, UX/UI designers, narrative designers</li>
                      <li><strong>Art:</strong> Art directors, concept artists, 3D artists, technical artists, animators</li>
                      <li><strong>Engineering:</strong> Gameplay programmers, engine programmers, tools developers</li>
                      <li><strong>Production:</strong> Producers, project managers, community managers</li>
                      <li><strong>Audio:</strong> Sound designers, audio programmers, composers</li>
                      <li><strong>Strategy:</strong> Publishing consultants, monetization experts, marketing specialists</li>
                    </ul>
                    <p>
                      Each professional has been vetted and comes with a track record of shipped games and industry experience.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    What kinds of opportunities are posted?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">Projects range from:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                      <li><strong>Short-term contracts:</strong> 2-8 week focused engagements for specific features or milestones</li>
                      <li><strong>Consulting:</strong> Expert reviews, design audits, technical assessments</li>
                      <li><strong>Freelance projects:</strong> Art creation, audio implementation, tool development</li>
                      <li><strong>Interim roles:</strong> Temporary leadership positions during transitions</li>
                      <li><strong>Stealth collaborations:</strong> Unannounced projects requiring discretion</li>
                    </ul>
                    <p>
                      All opportunities include clear scope, timeline, and compensation details upfront.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    How does verification work?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">
                      Every talent profile is verified through our multi-step process that includes portfolio review, industry reference checks, and validation of shipped games or professional experience.
                    </p>
                    <p className="mb-3">
                      For gig posters, we verify company information, project legitimacy, and funding status to ensure all opportunities are real and actionable.
                    </p>
                    <p>
                      This verification process is what sets us apart from open marketplaces—both sides can trust they're working with legitimate, qualified professionals.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left text-white hover:text-primary text-sm">
                    How do I get started?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm">
                    <p className="mb-3">
                      <strong>If you're talent:</strong> You'll need an invite token from an existing member. Once you have one, use it during signup to begin your verification process.
                    </p>
                    <p className="mb-3">
                      <strong>If you're posting gigs:</strong> You can sign up directly to create your company profile and post your first opportunity.
                    </p>
                    <p>
                      Questions? Reach out to us at <a href="mailto:hello@blacklabel.gg" className="text-primary hover:underline">hello@blacklabel.gg</a>
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
