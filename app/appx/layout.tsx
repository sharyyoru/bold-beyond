export default function AppXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-app="true" className="min-h-screen bg-gray-100 overflow-hidden">
      {children}
    </div>
  );
}
