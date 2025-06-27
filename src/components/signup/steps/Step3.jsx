import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Step3 = ({ form }) => (
  <>
    <FormField
      control={form.control}
      name="email"
      rules={{
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter a valid email address",
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Email Address</FormLabel>
          <FormControl>
            <Input type="email" placeholder="hello@walrus.ooo" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="mobile"
      rules={{
        required: "Mobile number is required",
        pattern: {
          value: /^\d{10,}$/,
          message: "Enter a valid mobile number with at least 10 digits",
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Mobile Number</FormLabel>
          <FormControl>
            <Input placeholder="e.g. +919999999999" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      rules={{
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Create a Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="*****" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="confirmPassword"
      rules={{
        required: "Please confirm your password",
        validate: (value) =>
          value === form.getValues("password") || "Passwords do not match",
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm the Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="*****" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default Step3;
