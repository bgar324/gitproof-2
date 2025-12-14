// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Make sure this path points to where you put File 1

export const { GET, POST } = handlers