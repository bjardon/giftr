import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center h-screen pt-20">
      <SignUp />
    </div>
  );
}
