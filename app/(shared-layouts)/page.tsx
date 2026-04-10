import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import Link from "next/link";

export default function Home(){
  return(
  <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-81px)] px-6 lg:px-20 gap-10 ml-15 mr-15" >
    <section className="flex-1 space-y-6 h-117">
      <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">Nail Your Next Big <br /> Interview With an <br /> <span className="text-blue-500">AI Mentor</span></h1>
      <p className="text-lg text-slate-500 max-w-md">Practice real-time coding and behavioral questions with an AI that adapts to your skill level.</p>
      <Link href="/auth/sign-up"><Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.4)]">Start Training for Free</Button></Link>
    </section>

    <section className="flex-1 flex justify-center lg:justify-end w-full">
        <Card className="dark:bg-zinc-900 border-zinc-900 dark:border-zinc-800 shadow-2xl rounded-3xl w-full max-w-[480px] overflow-hidden">
          <CardHeader className="border-b border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              Live Interview Simulation
            </CardTitle>
          </CardHeader>
          
          <CardContent className="h-[350px] p-6 flex items-end">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl rounded-bl-none text-sm text-blue-700 dark:text-blue-300">
              Tell me about a time you handled a difficult technical challenge...
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-400 dark:border-zinc-800 flex gap-3">
            <div className="relative flex-1">
              <Input 
                placeholder="Type your response..." 
                className="rounded-full pl-4 pr-10 h-9 border-zinc-300 focus:ring-blue-500" 
              />
            </div>
            <Button size="icon" className="rounded-full bg-blue-600">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="rounded-full bg-zinc-900 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </section>
  </div>
  )
}