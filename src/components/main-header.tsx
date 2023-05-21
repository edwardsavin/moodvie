import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import type { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Clapperboard, HistoryIcon, LogOut } from "lucide-react";

export const MainHeader = ({ user }: { user: ReturnType<typeof useUser> }) => {
  return (
    <header className="flex items-center px-4 py-6">
      <div className="flex w-full items-center justify-between px-4">
        <Link href="/" passHref className="flex items-center justify-center">
          {/* TODO: change to a proper svg */}
          <Image
            src="/favicon.ico"
            alt="Moodvie Logo"
            width={32}
            height={32}
            className="inline-block"
          />
          <span className="ml-2 text-2xl font-bold">Moodvie</span>
        </Link>

        <NavigationMenu className="mr-1 hidden w-full items-center justify-end md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/recommendations" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Recommendations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <Link href="/history" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                History
              </NavigationMenuLink>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>

        {user.isSignedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={user.user.profileImageUrl}
                  alt="Profile Image"
                />
                <AvatarFallback>{user.user.fullName}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.user.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Clapperboard className="mr-2 h-4 w-4" />
                <Link href="/recommendations" passHref>
                  <span>Your recommendations</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HistoryIcon className="mr-2 h-4 w-4" />
                <Link href="/history" passHref>
                  <span>Your history</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
