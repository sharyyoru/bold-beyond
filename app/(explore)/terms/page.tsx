export default function TermsPage() {
  return (
    <div className="container py-12 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>
      <p className="text-sm text-muted-foreground">
        These terms govern the use of the Bold & Beyond platform and services.
        This is a placeholder document and should be replaced with final legal
        content before going live.
      </p>
    </div>
  );
}
