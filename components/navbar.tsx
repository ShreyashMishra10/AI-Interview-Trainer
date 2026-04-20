import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { ModeToggle } from "./theme-toggle"
export function Navbar(){
    return(
        <div className="border-b border-zinc-400 font-sans font-medium text-sm tracking-wide text-zinc-600 dark:text-zinc-300">
        <header className="flex items-center ml-2.5 mr-2.5 justify-between h-20">
            <div className="font-sans tracking-tighter text-5xl">
                <Link href="/">AI-Trainer</Link>
            </div>
            <div className="flex font-sans text-2xl gap-5"><Link className="hover:text-gray-500" href="/">Home</Link>
                <Link className="hover:text-gray-500" href="/about">About</Link>
                <Link className="hover:text-gray-500" href="/services">Services</Link>
            </div>
            <div className="flex font-sans items-center gap-4">
                <Link href="/sign-up" className={buttonVariants({className: "w-17 rounded-full order-zinc-950"})}>Sign-Up</Link>
                <Link href="/sign-in" className={buttonVariants({
                    variant: "outline",
                    className: "w-17 rounded-full border-zinc-950"
                })}>Login</Link>
                <ModeToggle />
            </div>
        </header>
        </div>
    )
}