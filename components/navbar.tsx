import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { ModeToggle } from "./theme-toggle"
export function Navbar(){
    return(
        <div className="border-b border-zinc-300">
        <header className="flex items-center ml-2.5 mr-2.5 justify-between h-20">
            <div className="font-sans tracking-tighter text-5xl">
                <Link href="/">AI-Trainer</Link>
            </div>
            <div className="flex text-2xl gap-5"><Link href="/">Home</Link>
                <Link className="hover:text-gray-500" href="/about">About</Link>
                <Link className="hover:text-gray-500" href="/services">Services</Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/auth/sign-up" className={buttonVariants({className: "w-17 rounded-full order-zinc-950"})}>Sign Up</Link>
                <Link href="/auth/login" className={buttonVariants({
                    variant: "outline",
                    className: "w-17 rounded-full border-zinc-950"
                })}>Login</Link>
                <ModeToggle />
            </div>
        </header>
        </div>
    )
}