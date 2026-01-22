
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

const unitConfig = {
  length: {
    label: 'Length',
    units: {
      meters: { label: 'Meters', toBase: (m: number) => m },
      kilometers: { label: 'Kilometers', toBase: (km: number) => km * 1000 },
      centimeters: { label: 'Centimeters', toBase: (cm: number) => cm / 100 },
      millimeters: { label: 'Millimeters', toBase: (mm: number) => mm / 1000 },
      miles: { label: 'Miles', toBase: (mi: number) => mi * 1609.34 },
      yards: { label: 'Yards', toBase: (yd: number) => yd * 0.9144 },
      feet: { label: 'Feet', toBase: (ft: number) => ft * 0.3048 },
      inches: { label: 'Inches', toBase: (inch: number) => inch * 0.0254 },
    },
    baseUnit: 'meters'
  },
  mass: {
    label: 'Mass',
    units: {
      grams: { label: 'Grams', toBase: (g: number) => g },
      kilograms: { label: 'Kilograms', toBase: (kg: number) => kg * 1000 },
      milligrams: { label: 'Milligrams', toBase: (mg: number) => mg / 1000 },
      pounds: { label: 'Pounds', toBase: (lb: number) => lb * 453.592 },
      ounces: { label: 'Ounces', toBase: (oz: number) => oz * 28.3495 },
    },
    baseUnit: 'grams'
  },
  temperature: {
    label: 'Temperature',
    units: {
      celsius: { label: 'Celsius', toBase: (c: number) => c, fromBase: (b: number) => b },
      fahrenheit: { label: 'Fahrenheit', toBase: (f: number) => (f - 32) * 5/9, fromBase: (b: number) => (b * 9/5) + 32 },
      kelvin: { label: 'Kelvin', toBase: (k: number) => k - 273.15, fromBase: (b: number) => b + 273.15 },
    },
    baseUnit: 'celsius'
  },
  volume: {
    label: 'Volume',
     units: {
      liters: { label: 'Liters', toBase: (l: number) => l },
      milliliters: { label: 'Milliliters', toBase: (ml: number) => ml / 1000 },
      gallons: { label: 'Gallons (US)', toBase: (gal: number) => gal * 3.78541 },
      quarts: { label: 'Quarts (US)', toBase: (qt: number) => qt * 0.946353 },
    },
    baseUnit: 'liters'
  },
  speed: {
    label: 'Speed',
    units: {
      mps: { label: 'Meters/sec', toBase: (mps: number) => mps },
      kph: { label: 'Kilometers/hour', toBase: (kph: number) => kph / 3.6 },
      mph: { label: 'Miles/hour', toBase: (mph: number) => mph * 0.44704 },
    },
    baseUnit: 'mps'
  },
  area: {
    label: 'Area',
    units: {
      sq_meters: { label: 'Square Meters', toBase: (m2: number) => m2 },
      sq_kilometers: { label: 'Square Kilometers', toBase: (km2: number) => km2 * 1e6 },
      sq_miles: { label: 'Square Miles', toBase: (mi2: number) => mi2 * 2.59e6 },
      acres: { label: 'Acres', toBase: (ac: number) => ac * 4046.86 },
    },
    baseUnit: 'sq_meters'
  },
  data_transfer_rate: {
    label: 'Data Transfer Rate',
    units: {
        bps: { label: 'Bits per second', toBase: (v: number) => v },
        kbps: { label: 'Kilobits per second', toBase: (v: number) => v * 1000 },
        mbps: { label: 'Megabits per second', toBase: (v: number) => v * 1e6 },
        gbps: { label: 'Gigabits per second', toBase: (v: number) => v * 1e9 },
        Bps: { label: 'Bytes per second', toBase: (v: number) => v * 8 },
        kBps: { label: 'Kilobytes per second', toBase: (v: number) => v * 8000 },
        mBps: { label: 'Megabytes per second', toBase: (v: number) => v * 8e6 },
        gBps: { label: 'Gigabytes per second', toBase: (v: number) => v * 8e9 },
    },
    baseUnit: 'bps',
  },
  digital_storage: {
      label: 'Digital Storage',
      units: {
          byte: { label: 'Byte', toBase: (v: number) => v },
          kilobyte: { label: 'Kilobyte', toBase: (v: number) => v * 1024 },
          megabyte: { label: 'Megabyte', toBase: (v: number) => v * Math.pow(1024, 2) },
          gigabyte: { label: 'Gigabyte', toBase: (v: number) => v * Math.pow(1024, 3) },
          terabyte: { label: 'Terabyte', toBase: (v: number) => v * Math.pow(1024, 4) },
      },
      baseUnit: 'byte',
  },
  energy: {
      label: 'Energy',
      units: {
          joule: { label: 'Joule', toBase: (v: number) => v },
          kilojoule: { label: 'Kilojoule', toBase: (v: number) => v * 1000 },
          calorie: { label: 'Calorie', toBase: (v: number) => v * 4.184 },
          kilocalorie: { label: 'Kilocalorie (Cal)', toBase: (v: number) => v * 4184 },
      },
      baseUnit: 'joule',
  },
  frequency: {
      label: 'Frequency',
      units: {
          hertz: { label: 'Hertz', toBase: (v: number) => v },
          kilohertz: { label: 'Kilohertz', toBase: (v: number) => v * 1000 },
          megahertz: { label: 'Megahertz', toBase: (v: number) => v * 1e6 },
          gigahertz: { label: 'Gigahertz', toBase: (v: number) => v * 1e9 },
      },
      baseUnit: 'hertz',
  },
  fuel_economy: {
      label: 'Fuel Economy',
      units: {
          mpg: { label: 'Miles per Gallon (US)', toBase: (v: number) => 235.215 / v, fromBase: (b: number) => 235.215 / b },
          kpl: { label: 'Kilometers per Liter', toBase: (v: number) => 100 / v, fromBase: (b: number) => 100 / b },
      },
      baseUnit: 'kpl',
  },
  plane_angle: {
      label: 'Plane Angle',
      units: {
          degree: { label: 'Degree', toBase: (v: number) => v },
          radian: { label: 'Radian', toBase: (v: number) => v * (180 / Math.PI) },
          gradian: { label: 'Gradian', toBase: (v: number) => v * 0.9 },
      },
      baseUnit: 'degree',
  },
  pressure: {
      label: 'Pressure',
      units: {
          pascal: { label: 'Pascal', toBase: (v: number) => v },
          bar: { label: 'Bar', toBase: (v: number) => v * 100000 },
          psi: { label: 'Pound-force/sq inch (PSI)', toBase: (v: number) => v * 6894.76 },
          atm: { label: 'Atmosphere (atm)', toBase: (v: number) => v * 101325 },
      },
      baseUnit: 'pascal',
  },
  time: {
      label: 'Time',
      units: {
          second: { label: 'Second', toBase: (v: number) => v },
          minute: { label: 'Minute', toBase: (v: number) => v * 60 },
          hour: { label: 'Hour', toBase: (v: number) => v * 3600 },
          day: { label: 'Day', toBase: (v: number) => v * 86400 },
          week: { label: 'Week', toBase: (v: number) => v * 604800 },
      },
      baseUnit: 'second',
  },
};

type Category = keyof typeof unitConfig;

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');

  useEffect(() => {
    const units = Object.keys(unitConfig[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setOutputValue('');
      return;
    }
    
    const categoryData = unitConfig[category];
    const fromData = categoryData.units[fromUnit as keyof typeof categoryData.units];
    const toData = categoryData.units[toUnit as keyof typeof categoryData.units];

    if (!fromData || !toData) {
        setOutputValue('');
        return;
    }
    
    const baseValue = fromData.toBase(value);

    let finalValue;
    if (toData.fromBase) { // Use specific fromBase if available
        finalValue = toData.fromBase(baseValue);
    } else { // Otherwise, invert the toBase function
        const toUnitBaseValue = toData.toBase(1);
        finalValue = baseValue / toUnitBaseValue;
    }
    
    setOutputValue(finalValue.toLocaleString(undefined, { maximumFractionDigits: 5 }));

  }, [inputValue, fromUnit, toUnit, category]);
  
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const currentUnits = unitConfig[category].units;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Unit Converter</CardTitle>
        <CardDescription>Convert between different units of measurement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger id="category"><SelectValue/></SelectTrigger>
                <SelectContent>
                {Object.entries(unitConfig).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] gap-2 items-center">
            <div className="space-y-2">
                <Label htmlFor="from-unit">From</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger id="from-unit"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        {Object.entries(currentUnits).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{(value as any).label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="ghost" size="icon" className="self-end" onClick={handleSwap}>
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-2">
                <Label htmlFor="to-unit">To</Label>
                 <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger id="to-unit"><SelectValue/></SelectTrigger>
                    <SelectContent>
                         {Object.entries(currentUnits).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{(value as any).label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="input-value">Value</Label>
            <Input id="input-value" type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        </div>

        <div className="space-y-2">
            <Label>Converted Value</Label>
            <div className="flex items-center h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {outputValue}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
