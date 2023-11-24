import UserAuthForm from "@/components/UserAuthForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getAuthSession();

  if (session) redirect("/dashboard?tab=classes");

  return (
    <div className="h-full max-w-2xl m-auto flex flex-col items-center justify-center gap-20">
      <div className="py-10 px-2 rounded-lg border border-inherit">
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Witamy w kreatorze planu zajęć!
            </h1>
            <p className="text-sm max-w-xs mx-auto">
              Zaloguj się do aplikacji wykorzystując swoje konto Google.
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
