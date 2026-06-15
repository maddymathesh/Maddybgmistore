import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#080a0f] py-12">
      <SignIn />
    </div>
  );
}
