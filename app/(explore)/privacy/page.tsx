export default function PrivacyPage() {
  return (
    <div className="container py-12 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>
      <p className="text-sm text-muted-foreground">
        This page outlines how Bold & Beyond collects, uses, and protects your
        personal information. It is a non-final placeholder and should be
        replaced with your legal teams approved policy before launch.
      </p>
    </div>
  );
}
