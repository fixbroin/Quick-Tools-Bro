
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const womenData = [
  { height_cm: 147, height_ft: "4'10\"", weight_kg: "41-52", weight_lbs: "91-115" },
  { height_cm: 150, height_ft: "4'11\"", weight_kg: "42-53", weight_lbs: "94-119" },
  { height_cm: 152, height_ft: "5'0\"", weight_kg: "43-55", weight_lbs: "97-123" },
  { height_cm: 155, height_ft: "5'1\"", weight_kg: "45-57", weight_lbs: "100-127" },
  { height_cm: 157, height_ft: "5'2\"", weight_kg: "46-59", weight_lbs: "104-131" },
  { height_cm: 160, height_ft: "5'3\"", weight_kg: "48-61", weight_lbs: "107-135" },
  { height_cm: 163, height_ft: "5'4\"", weight_kg: "49-63", weight_lbs: "110-140" },
  { height_cm: 165, height_ft: "5'5\"", weight_kg: "51-65", weight_lbs: "114-144" },
  { height_cm: 168, height_ft: "5'6\"", weight_kg: "53-67", weight_lbs: "118-148" },
  { height_cm: 170, height_ft: "5'7\"", weight_kg: "54-69", weight_lbs: "121-153" },
  { height_cm: 173, height_ft: "5'8\"", weight_kg: "56-71", weight_lbs: "125-158" },
  { height_cm: 175, height_ft: "5'9\"", weight_kg: "58-73", weight_lbs: "129-163" },
  { height_cm: 178, height_ft: "5'10\"", weight_kg: "60-75", weight_lbs: "132-167" },
  { height_cm: 180, height_ft: "5'11\"", weight_kg: "61-78", weight_lbs: "136-172" },
  { height_cm: 183, height_ft: "6'0\"", weight_kg: "63-80", weight_lbs: "141-177" },
];

const menData = [
  { height_cm: 163, height_ft: "5'4\"", weight_kg: "54-65", weight_lbs: "118-144" },
  { height_cm: 165, height_ft: "5'5\"", weight_kg: "55-67", weight_lbs: "121-148" },
  { height_cm: 168, height_ft: "5'6\"", weight_kg: "57-69", weight_lbs: "125-153" },
  { height_cm: 170, height_ft: "5'7\"", weight_kg: "59-71", weight_lbs: "129-158" },
  { height_cm: 173, height_ft: "5'8\"", weight_kg: "61-73", weight_lbs: "133-163" },
  { height_cm: 175, height_ft: "5'9\"", weight_kg: "63-75", weight_lbs: "137-168" },
  { height_cm: 178, height_ft: "5'10\"", weight_kg: "64-78", weight_lbs: "141-173" },
  { height_cm: 180, height_ft: "5'11\"", weight_kg: "66-80", weight_lbs: "145-178" },
  { height_cm: 183, height_ft: "6'0\"", weight_kg: "68-83", weight_lbs: "150-183" },
  { height_cm: 185, height_ft: "6'1\"", weight_kg: "70-85", weight_lbs: "154-188" },
  { height_cm: 188, height_ft: "6'2\"", weight_kg: "72-87", weight_lbs: "159-194" },
  { height_cm: 191, height_ft: "6'3\"", weight_kg: "74-90", weight_lbs: "163-200" },
  { height_cm: 193, height_ft: "6'4\"", weight_kg: "76-92", weight_lbs: "168-205" },
];


const ChartTable = ({ data }: { data: typeof womenData | typeof menData }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Height (cm)</TableHead>
        <TableHead>Height (ft/in)</TableHead>
        <TableHead>Weight (kg)</TableHead>
        <TableHead>Weight (lbs)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.height_cm}>
          <TableCell>{row.height_cm}</TableCell>
          <TableCell>{row.height_ft}</TableCell>
          <TableCell>{row.weight_kg}</TableCell>
          <TableCell>{row.weight_lbs}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);


export function HealthyWeightChart() {
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle className="font-headline">Healthy Weight Chart</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="women">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="women">Women</TabsTrigger>
                    <TabsTrigger value="men">Men</TabsTrigger>
                </TabsList>
                <TabsContent value="women">
                    <ChartTable data={womenData} />
                </TabsContent>
                <TabsContent value="men">
                    <ChartTable data={menData} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}
