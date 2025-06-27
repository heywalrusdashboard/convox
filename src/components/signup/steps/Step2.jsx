import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Step2 = ({ form }) => (
  <>
    <FormField
      control={form.control}
      name="companionGoal"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Companion Goal</FormLabel>
          <FormControl>
            <Input
              {...field}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="companionPersona"
      rules={{ required: "Companion persona is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Companion Persona</FormLabel>
          <FormControl>
            <Textarea
              placeholder="You are Lucy, a companion for Walrus..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default Step2;
