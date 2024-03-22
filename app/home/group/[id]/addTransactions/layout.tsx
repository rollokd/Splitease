import TopNav from "@/components/addTransactions/TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen flex-col">
      <div className="w-full flex-row border-b-4">
        <TopNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
