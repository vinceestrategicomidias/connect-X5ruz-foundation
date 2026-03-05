import { useState, useRef } from "react";
import { format, parse, isValid, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChangeStart: (d: Date | undefined) => void;
  onChangeEnd: (d: Date | undefined) => void;
  className?: string;
}

const PRESETS = [
  { label: "Hoje", getValue: () => ({ start: new Date(), end: new Date() }) },
  { label: "7 dias", getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: "30 dias", getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: "Este mês", getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
  { label: "Mês anterior", getValue: () => ({ start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Ano atual", getValue: () => ({ start: startOfYear(new Date()), end: new Date() }) },
];

export const DateRangeFilter = ({ startDate, endDate, onChangeStart, onChangeEnd, className }: DateRangeFilterProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => {
    const s = startDate ? format(startDate, "dd/MM/yyyy") : "";
    const e = endDate ? format(endDate, "dd/MM/yyyy") : "";
    return s && e ? `${s} - ${e}` : "";
  });
  const [error, setError] = useState("");

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setError("");
    // Try to parse DD/MM/AAAA - DD/MM/AAAA
    const parts = val.split(" - ");
    if (parts.length === 2) {
      const d1 = parse(parts[0].trim(), "dd/MM/yyyy", new Date());
      const d2 = parse(parts[1].trim(), "dd/MM/yyyy", new Date());
      if (isValid(d1) && isValid(d2)) {
        onChangeStart(d1);
        onChangeEnd(d2);
      } else if (parts[0].trim().length === 10 || parts[1].trim().length === 10) {
        setError("Data inválida");
      }
    }
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    const { start, end } = preset.getValue();
    onChangeStart(start);
    onChangeEnd(end);
    setInputValue(`${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`);
    setError("");
  };

  const handleCalendarSelect = (type: "start" | "end", date: Date | undefined) => {
    if (type === "start") {
      onChangeStart(date);
    } else {
      onChangeEnd(date);
    }
    const s = type === "start" ? date : startDate;
    const e = type === "end" ? date : endDate;
    if (s && e) {
      setInputValue(`${format(s, "dd/MM/yyyy")} - ${format(e, "dd/MM/yyyy")}`);
    }
    setError("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3 w-3 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="DD/MM/AAAA - DD/MM/AAAA"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onClick={() => setOpen(true)}
              className={cn(
                "flex h-8 w-full rounded-md border border-input bg-background pl-7 pr-2 py-1 text-[11px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                error && "border-destructive",
                "min-w-[185px]"
              )}
            />
          </div>
          {error && <p className="text-[10px] text-destructive absolute -bottom-4 left-0">{error}</p>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <div className="p-3 space-y-3">
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="text-[10px] h-6 px-2"
                onClick={() => handlePreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Dual calendars */}
          <div className="flex gap-4">
            <div>
              <p className="text-xs font-medium mb-1 text-muted-foreground">Data inicial</p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(d) => handleCalendarSelect("start", d)}
                locale={ptBR}
                className="p-2 pointer-events-auto"
                initialFocus
              />
            </div>
            <div>
              <p className="text-xs font-medium mb-1 text-muted-foreground">Data final</p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(d) => handleCalendarSelect("end", d)}
                locale={ptBR}
                className="p-2 pointer-events-auto"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
