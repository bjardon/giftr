"use client";

import { useControl } from "@conform-to/react/future";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormDatePickerProps {
  field: {
    id: string;
    name: string;
    key?: string;
    initialValue?: string;
    errorId?: string;
    errors?: string[];
  };
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function dateToISOString(date: Date | undefined) {
  if (!date || !isValidDate(date)) {
    return "";
  }
  return date.toISOString().split("T")[0];
}

function parseISODate(isoString: string | undefined): Date | undefined {
  if (!isoString) return undefined;
  const date = new Date(isoString);
  return isValidDate(date) ? date : undefined;
}

/**
 * Form-aware DatePicker component that integrates with Conform using useControl.
 * Combines an input field with a calendar popover for date selection.
 *
 * Stores date as ISO string (YYYY-MM-DD) for FormData compatibility.
 *
 * @see https://conform.guide/integration/ui-libraries
 */
export function FormDatePicker({
  field,
  label,
  required,
  placeholder = "Selecciona una fecha",
  className,
  onFocus,
}: FormDatePickerProps) {
  const control = useControl({
    defaultValue: field.initialValue,
    onFocus,
  });

  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/refs
  const selectedDate = parseISODate(control.value);
  const [month, setMonth] = useState<Date | undefined>(
    selectedDate || new Date()
  );
  const [displayValue, setDisplayValue] = useState(formatDate(selectedDate));

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={field.id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <input
        type="hidden"
        name={field.name}
        // eslint-disable-next-line react-hooks/refs
        ref={control.register}
        key={field.key}
      />
      <div className="relative flex gap-2">
        <Input
          id={field.id}
          value={displayValue}
          placeholder={placeholder}
          className={`pr-10 ${
            field.errors
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
              : className
          }`}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setDisplayValue(e.target.value);
            if (isValidDate(date)) {
              control.change(dateToISOString(date));
              setMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          onBlur={() => control.blur()}
          aria-invalid={field.errors ? true : undefined}
          aria-describedby={field.errors ? field.errorId : undefined}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Seleccionar fecha</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                const isoDate = dateToISOString(date);
                control.change(isoDate);
                setDisplayValue(formatDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {field.errors && (
        <div id={field.errorId} className="text-sm text-destructive">
          {field.errors}
        </div>
      )}
    </div>
  );
}
