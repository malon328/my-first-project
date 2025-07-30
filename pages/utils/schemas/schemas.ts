
import { z } from "zod";

export const Schema = z.object({
  titel: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
   categoryName: z.string().min(1),
  tagNames: z.array(z.string().min(1)).nonempty()
});
