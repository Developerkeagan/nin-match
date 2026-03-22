const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
  { label: "Meet the Team", href: "#" },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company info */}
          <div>
            <h3 className="font-display text-xl font-bold">
              NIN<span className="text-primary">Jobs</span>
            </h3>
            <p className="mt-3 text-sm text-background/50 leading-relaxed max-w-xs">
              AI-powered job matching platform built on verified national identity. Connecting talent to opportunity across Nigeria.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-background/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-background/40 mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-sm text-background/60 hover:text-background transition-colors duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10 py-6">
        <p className="text-center text-xs text-background/30">
          © 2026 NINJobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
