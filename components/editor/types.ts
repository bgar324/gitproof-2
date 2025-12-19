import type { Project } from "@prisma/client";

export type ProjectWithPublic = Project & {
  isPublic?: boolean | null;
};
