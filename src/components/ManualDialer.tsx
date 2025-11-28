import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscadorTelefonico } from "./DiscadorTelefonico";

export const ManualDialer = () => {
  const [showDiscador, setShowDiscador] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowDiscador(true)}>
        <Phone className="h-4 w-4 mr-2" />
        Discar
      </Button>
      <DiscadorTelefonico open={showDiscador} onOpenChange={setShowDiscador} />
    </>
  );
};
