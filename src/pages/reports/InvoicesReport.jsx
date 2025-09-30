import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InvoicesReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          Billing data not available via dashboard API yet.
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoicesReport;
