import { useNavigate } from "react-router-dom";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
}

const ExecutivePlaceholder = ({ title, description }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{description}</p>
      <Button variant="outline" className="rounded-none mt-6" onClick={() => navigate("/executive")}>
        Back to Overview
      </Button>
    </div>
  );
};

export default ExecutivePlaceholder;
