import TopNav from "@/components/addTransactions/TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen flex-col">
      <div className="flex flex-col p-6 w-full">{children}</div>
    </div>
  );
}
