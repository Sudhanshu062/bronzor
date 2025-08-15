"use client"

import React, { useState } from 'react'

import { useFormik } from 'formik'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { RegisterForm } from '@/components/forms/register'

import { GenerateEmailButton } from '@/components/layout/buttons/generate-email'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Modal } from '@/components/wrappers/modal'

import { useGeneratedUser } from '@/hooks/use-generated-user'
import { useToken } from '@/hooks/use-token'

import { POST } from '@/utilities/requests/post';

const LoginForm = () => {

    const [isVisible, setIsVisible] = useState<boolean>(false)

    const { setToken } = useToken()
    const { user } = useGeneratedUser()

    const formik = useFormik({

        initialValues: {
            address: user?.address || '',
            password: user?.password || '',
        },

        enableReinitialize: true,

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()

            try {

                const { data } = await POST<{
                    address: string;
                    password: string;
                }, {
                    token: string;
                }>({
                    url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/token`,
                    data: values,
                    notifications: {
                        loading: "Logging in ...",
                        success: "Login successful!",
                        error: "Login failed. Please try again."
                    }
                })

                setToken(data.token)

            } catch (error) { console.error("error") }

            finally { setSubmitting(false) }

        }

    })

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    return (
        <form onSubmit={formik.handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                        Login to your Acme Inc account
                    </p>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="address"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={formik.values.address}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={isVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            className="pe-9"
                        />
                        <button
                            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label={isVisible ? "Hide password" : "Show password"}
                            aria-pressed={isVisible}
                            aria-controls="password"
                        >
                            {isVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 px-2">{formik.errors.password}</div>
                    )}
                </div>
                <Button type='submit' disabled={formik.isSubmitting} className='w-full'>
                    {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>
                <GenerateEmailButton />
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Modal
                        title='Create an account'
                        description='Create an account to start using our services.'
                        content={(onClose) => <RegisterForm onClose={onClose} />}
                    >
                        <span className="underline underline-offset-4 cursor-pointer">Sign up</span>
                    </Modal>
                </div>
            </div>
        </form>
    )
}

export { LoginForm }