import Link from "next/link";
import { UserNav } from "./user-nav";
import Image from "next/image";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* --- 1. LOGO --- */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl mr-8"
        >
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <Image
              src="/subman_logo.png"
              alt="subman_logo"
              width={30}
              height={30}
            />
          </div>
          <div>
            <span className="text-[#1E3A6A]">Sub</span>
            <span className="text-[#1CAFA7]">Man</span>
          </div>
        </Link>

        {/* --- 2. ESPAÇADOR --- */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Menu do Usuário */}
          <UserNav />
        </div>
      </div>
    </div>
  );
}
