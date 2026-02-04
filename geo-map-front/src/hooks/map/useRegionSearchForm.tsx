import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const regionSearchFormSchema = z.object({
  regionName: z.string(),
});

export type RegionSearchFormData = z.infer<typeof regionSearchFormSchema>;

function useRegionSearchForm() {
  const methods = useForm<RegionSearchFormData>({
    resolver: zodResolver(regionSearchFormSchema),
    defaultValues: {
      regionName: "",
    },
  });

  return methods;
}

export default useRegionSearchForm;
