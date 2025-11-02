import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="m-auto w-fit">
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
