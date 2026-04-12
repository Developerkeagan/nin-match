import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const AdminPlaceholder = () => {
  const { pathname } = useLocation();
  const page = pathname.split("/").pop() || "page";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h2 className="text-xl font-semibold text-foreground capitalize">{page}</h2>
      <p className="text-sm text-muted-foreground mt-1">This section is under development</p>
    </div>
  );
};

export default AdminPlaceholder;
