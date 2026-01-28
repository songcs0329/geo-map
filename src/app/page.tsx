import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Blog Geo Map</CardTitle>
          <CardDescription className="text-lg">
            A modern blog application with geo mapping features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js, TailwindCSS, shadcn/ui</p>
        <p>Zustand, React Query, Zod, React Hook Form</p>
      </footer>
    </div>
  );
}
