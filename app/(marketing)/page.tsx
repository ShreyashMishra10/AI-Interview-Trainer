import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home(){
  return(
  <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-81px)] px-6 lg:px-20 gap-10 ml-15 mr-15" >
    <section className="flex-1 space-y-6 h-117">
      <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">Nail Your Next Big <br /> Interview With an <br /> <span className="text-blue-500">AI Mentor</span></h1>
      <p className="text-lg text-slate-500 max-w-md">Practice real-time coding and behavioral questions with an AI that adapts to your skill level.</p>
      <Link href="/sign-up"><Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.4)]">Start Training for Free</Button></Link>
    </section>
    <ChatInterface />
  </div>
  )
}