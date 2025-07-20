import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = [
  "Retail",
  "E-commerce",
  "Manufacturing",
  "Consulting / Services",
  "Logistics & supply chain",
  "Real Estate",
  "Healthcare / Wellness",
  "Education & Training",
  "Finance / Insurance",
  "Hospitality / Travel",
  "Media / Entertainment",
  "Technology / Saas",
  "Other",
];

const Step1 = ({ form }) => {
  const [showOther, setShowOther] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="companyName"
        rules={{ required: "Company Name is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Value" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="websiteURL"
        rules={{
          required: "Website is required"
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Website URL</FormLabel>
            <FormControl>
              <Input placeholder="Eg: www.walrus.ooo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="industry"
        rules={{ required: "Industry is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <div className="w-full">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowOther(value === "Other");
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOther && (
        <FormField
          control={form.control}
          name="customIndustry"
          rules={{ required: "Please specify your industry" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Industry</FormLabel>
              <FormControl>
                <Input placeholder="Please specify your industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default Step1;
