import { cn } from "@/lib/utils";

interface ConnectMessageBubbleProps {
  content: string;
  time: string;
  type: "patient" | "attendant";
  senderName?: string;
}

export const ConnectMessageBubblePatient = ({
  content,
  time,
  senderName,
}: Omit<ConnectMessageBubbleProps, "type">) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%]">
        {senderName && (
          <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
        )}
        <div className="bg-card border border-border rounded-lg rounded-tl-none p-3 connect-shadow">
          <p className="text-sm text-foreground">{content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">{time}</p>
      </div>
    </div>
  );
};

export const ConnectMessageBubbleAttendant = ({
  content,
  time,
}: Omit<ConnectMessageBubbleProps, "type" | "senderName">) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[70%]">
        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 connect-shadow">
          <p className="text-sm">{content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1 text-right">{time}</p>
      </div>
    </div>
  );
};
