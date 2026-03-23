import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const PlaceholderPage = () => {
  const { pathname } = useLocation();
  const name = pathname.split("/").filter(Boolean).pop() || "Page";
  const title = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">{title}</h1>
      <Card className="rounded-none shadow-sm">
        <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <Construction className="h-10 w-10" />
          <p className="text-sm font-medium">This page is coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
