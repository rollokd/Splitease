import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const svgIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

interface CardTotalsProps {
  myColor: string;
  title: string;
  amount: string;
}

const cardTotals = ({ myColor, title, amount }: CardTotalsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className={`text-sm font-medium ${myColor}`}>
          {title}
        </CardTitle>
        {svgIcon}
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-2xl font-bold">${amount}</div>
      </CardContent>
    </Card>
  );
};

export default cardTotals;
