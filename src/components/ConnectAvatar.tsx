import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConnectAvatarProps {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg";
}

export const ConnectAvatar = ({ name, image, size = "md" }: ConnectAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
