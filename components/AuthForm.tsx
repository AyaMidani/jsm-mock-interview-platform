"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { toast } from "sonner";
import FormField from "./FormField";


type FormType = "signin" | "signup";


const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === "signup" ? z.string().min(3, "Name is required") : z.string().optional(),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(3, "Password must be at least 3 characters"),
    });
}


function AuthForm({ type }: { type: FormType }) {
  const formSchema = AuthFormSchema(type);
  const router = useRouter();
  type FormValues = z.infer<typeof formSchema>;

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    try { 
        if (type === "signup") {
        toast.success(`Account created for ${data.name} with email ${data.email}`);
        router.push("/sign-in");
        } 
        else {
        toast.success(`Signed in with email ${data.email}`);
        router.push("/");
        }
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred: ${error}`)
    }   
  }
  
  const isSignIn = type === "signin";

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" width={38} height={32}/>
                <h2 className="text-primary-100">PrepWise</h2>
            </div>
            <h3>Practice job interviews with AI</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                {! isSignIn && (
                    <FormField<FormValues> control={control} name="name" label="Name" placeholder="Enter your name"/>
                )}
                    <FormField<FormValues> control={control} name="email" label="Email" placeholder="Enter your email"/>
                    <FormField<FormValues> control={control} name="password" label="Password" placeholder="Enter your password" type="password"/>
            <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Create an Account"}</Button>
            </form>
            <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="ml-1 font-bold text-user-primary"
                >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
    </div>
    </div>
  );
}

export default AuthForm;