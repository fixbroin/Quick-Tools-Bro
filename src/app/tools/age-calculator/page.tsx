
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInWeeks, differenceInHours, differenceInMinutes, intervalToDuration, differenceInSeconds } from 'date-fns';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const formSchema = z.object({
  day: z.string().min(1, "Day is required.").max(2, "Invalid day."),
  month: z.string().min(1, "Month is required.").max(2, "Invalid month."),
  year: z.string().min(4, "Year must be 4 digits.").max(4, "Invalid year."),
  hour: z.string().optional(),
  minute: z.string().optional(),
}).refine(data => {
    const day = parseInt(data.day, 10);
    const month = parseInt(data.month, 10);
    const year = parseInt(data.year, 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (year < 1900 || year > new Date().getFullYear() + 1) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    const hour = data.hour ? parseInt(data.hour, 10) : 0;
    const minute = data.minute ? parseInt(data.minute, 10) : 0;

    const date = new Date(year, month - 1, day, hour, minute);
    if(date > new Date()) return false; // Future date check

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}, {
    message: "Please enter a valid past date.",
    path: ["day"], 
}).refine(data => {
    if (data.hour && data.hour.length > 0) {
        const hour = parseInt(data.hour, 10);
        if (isNaN(hour) || hour < 0 || hour > 23) return false;
    }
    return true;
}, {
    message: "0-23",
    path: ["hour"],
}).refine(data => {
    if (data.minute && data.minute.length > 0) {
        const minute = parseInt(data.minute, 10);
        if (isNaN(minute) || minute < 0 || minute > 59) return false;
    }
    return true;
}, {
    message: "0-59",
    path: ["minute"],
});


type FormValues = z.infer<typeof formSchema>;

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export default function AgeCalculatorPage() {
  const [result, setResult] = useState<AgeResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: ''
    }
  });

  const calculateAge = (data: FormValues) => {
    const today = new Date();
    const day = parseInt(data.day, 10);
    const month = parseInt(data.month, 10);
    const year = parseInt(data.year, 10);
    const hour = data.hour ? parseInt(data.hour, 10) : 0;
    const minute = data.minute ? parseInt(data.minute, 10) : 0;

    if(isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) return;
    
    const dob = new Date(year, month - 1, day, hour, minute);

    const duration = intervalToDuration({ start: dob, end: today });

    setResult({
      years: duration.years || 0,
      months: duration.months || 0,
      days: duration.days || 0,
      hours: duration.hours || 0,
      minutes: duration.minutes || 0,
      totalMonths: differenceInMonths(today, dob),
      totalWeeks: differenceInWeeks(today, dob),
      totalDays: differenceInDays(today, dob),
      totalHours: differenceInHours(today, dob),
      totalMinutes: differenceInMinutes(today, dob),
      totalSeconds: differenceInSeconds(today, dob),
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateAge)}>
          <CardHeader>
            <CardTitle className="font-headline">Age Calculator</CardTitle>
            <CardDescription>Enter your date of birth to calculate your exact age.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <div className="flex gap-2 pt-2">
                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="DD" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="MM" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="YYYY" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </FormItem>
            
            <Collapsible>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 -ml-4">
                        <ChevronsUpDown className="h-4 w-4" />
                        Add Time (Optional)
                        <span className="sr-only">Toggle time input</span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                     <div className="flex gap-2 pt-2">
                        <FormField
                            control={form.control}
                            name="hour"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Hour (0-23)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="HH" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minute"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Minute (0-59)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MM" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <Button type="submit">Calculate Age</Button>
          </CardContent>
        </form>
      </Form>
      {result && (
        <CardFooter className="flex-col items-start gap-4">
          <Alert>
            <AlertTitle className="text-2xl font-bold font-headline">Your Age Is</AlertTitle>
            <AlertDescription className="text-3xl text-primary font-bold mt-2">
              {result.years} years, {result.months} months, {result.days} days
              {(form.getValues('hour') || form.getValues('minute')) && `, ${result.hours} hours, ${result.minutes} minutes`}
            </AlertDescription>
          </Alert>
          <Alert>
             <AlertTitle className="font-headline">Summary</AlertTitle>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
                <div><span className="font-semibold">Total Months:</span> {result.totalMonths.toLocaleString()}</div>
                <div><span className="font-semibold">Total Weeks:</span> {result.totalWeeks.toLocaleString()}</div>
                <div><span className="font-semibold">Total Days:</span> {result.totalDays.toLocaleString()}</div>
                <div><span className="font-semibold">Total Hours:</span> {result.totalHours.toLocaleString()}</div>
                <div><span className="font-semibold">Total Minutes:</span> {result.totalMinutes.toLocaleString()}</div>
                <div><span className="font-semibold">Total Seconds:</span> {result.totalSeconds.toLocaleString()}</div>
             </div>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
