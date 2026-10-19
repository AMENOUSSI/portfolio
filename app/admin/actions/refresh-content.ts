import "server-only";
import { revalidatePath, updateTag } from "next/cache";

/**
 * Call from an admin Server Action after a write: expires the public site's
 * cached content for `tag` and the client-cached admin pages (lists, counts),
 * so both show the change on the next render.
 */
export function refreshContent(tag: string) {
  updateTag(tag);
  revalidatePath("/admin", "layout");
}
