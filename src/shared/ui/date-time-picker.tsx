"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/shared/lib/utils/index"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "날짜와 시간을 선택하세요",
  disabled = false,
  minDate,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }

    const newDate = new Date(date)
    if (value) {
      newDate.setHours(value.getHours())
      newDate.setMinutes(value.getMinutes())
    } else {
      newDate.setHours(9)
      newDate.setMinutes(0)
    }
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)

    onChange?.(newDate)
  }

  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    const numVal = parseInt(val, 10)
    const newDate = value ? new Date(value) : new Date()

    if (type === "hour") {
      newDate.setHours(numVal)
    } else {
      newDate.setMinutes(numVal)
    }
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)

    onChange?.(newDate)
  }

  return (
    <div className="space-y-3">
      {/* 선택된 날짜/시간 표시 및 토글 버튼 */}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between text-left font-normal",
          !value && "text-muted-foreground"
        )}
      >
        <span className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "yyyy년 MM월 dd일 HH:mm", { locale: ko })
          ) : (
            placeholder
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* 인라인 캘린더 및 시간 선택 */}
      {isOpen && (
        <div className="rounded-md border bg-background p-3 space-y-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={(date) => minDate ? date < minDate : false}
            locale={ko}
            className="rounded-md"
          />
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">시간:</span>
            <Select
              value={value ? String(value.getHours()) : undefined}
              onValueChange={(val) => handleTimeChange("hour", val)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="시" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={String(hour)}>
                    {String(hour).padStart(2, "0")}시
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              value={value ? String(value.getMinutes()) : undefined}
              onValueChange={(val) => handleTimeChange("minute", val)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="분" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={String(minute)}>
                    {String(minute).padStart(2, "0")}분
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
