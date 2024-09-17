'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"


const page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>> ({

    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    // using next-auth for signin
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })

    if(result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant: "destructive"
      })
      setIsSubmitting(false)

    } 

    if(result?.url) {
      router.replace('/dashboard')
      setIsSubmitting(false)
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join Anonymous Feedback
              </h1>
              <p className="mb-4">Sign in to start your anonymous adventure</p>
            </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email/Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email/username" 
                            {...field}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password"
                            placeholder="password" 
                            {...field}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      )}
                    />

                   <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                      </>
                    ) : ('Sign in')}
                   </Button>
                </form>

              </Form>
              <div className="text-center mt-4">
                <p>
                  Not a member?{' '}
                  <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign up
                  </Link>
                </p>
              </div>
        </div>
      
    </div>
  )
}

export default page