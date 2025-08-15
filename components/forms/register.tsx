"use client"

import React, { useEffect, useState } from 'react'

import { useFormik } from 'formik'
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { useDomains } from '@/hooks/use-domains'

import { createAccount } from "@/services/create-account"

import { GET } from '@/utilities/requests/get'

type Props = { onClose: () => void }

const RegisterForm = (props: Props) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)

    const [status, setStatus] = useState<{ isLoading: boolean }>({ isLoading: false });
    const [error, setError] = useState<string | null>(null);

    const { domains, setDomains } = useDomains()

    const formik = useFormik({

        initialValues: {
            username: '',
            password: '',
        },

        onSubmit: async (values, { setSubmitting }) => {

            setSubmitting(true)

            await formik.validateForm()

            try {

                const { status } = await createAccount(
                    `${values.username}@${domains[0].domain}`,
                    values.password
                )

                status === 201 && props.onClose()

            } catch (error) { console.error("error") }

            finally { setSubmitting(false) }

        }

    })

    useEffect(() => {

        if (status.isLoading || domains?.length > 0) return;
        setStatus({ isLoading: true });

        if (error) setError(null);

        const fetchDomains = async () => {

            try {

                const { data } = await GET<IPagedCollection<IDomain>>({
                    url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/domains`,
                })

                setDomains(data["hydra:member"]);

            } catch (error: any) {

                console.error("Error fetching domains:", error);
                setError("Failed to fetch domains. Please try again.");

            } finally { setStatus({ isLoading: false }) }

        };

        fetchDomains();

    }, [status.isLoading, error]);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
            <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="pl-2">Username</Label>
                <div className="relative">
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        required
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        className="peer pe-12"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        {status.isLoading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : error ? (
                            <span className="text-red-500">{error}</span>
                        ) : (<>@{domains?.length > 0 ? domains[0].domain : "example.com"}</>)}
                    </span>
                </div>
                {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 px-2">{formik.errors.username}</div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="pl-2">Password</Label>
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
            <Button type='submit' disabled={!formik.isValid || formik.isSubmitting}>
                {formik.isSubmitting ?
                    (<span>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                    </span>) : "Register"}
            </Button>
        </form>
    )
}

export { RegisterForm }