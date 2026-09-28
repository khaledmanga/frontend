import { formatDistanceToNow } from "date-fns";

export function relativeDate(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}
