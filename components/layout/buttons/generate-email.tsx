"use client"

import React, { useEffect, useState } from "react";

import { Copy, EyeIcon, EyeOffIcon, InfoIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Modal } from "@/components/wrappers/modal";

import { useDomains } from "@/hooks/use-domains";
import { useGeneratedUser } from "@/hooks/use-generated-user";

import { createAccount } from "@/services/create-account";

import { GET } from "@/utilities/requests/get";

import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { generatePassword } from "@/utils/generate-password";
import { generateUsername } from "@/utils/generate-username";

const GenerateEmailButton = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const [status, setStatus] = useState<{ isLoading: boolean }>({ isLoading: false });
    const [error, setError] = useState<string | null>(null);

    const [isVisible, setIsVisible] = useState<boolean>(false)

    const { domains, setDomains } = useDomains()
    const { user, setUser } = useGeneratedUser();

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    const handleGenerateEmail = async () => {

        setStatus({ isLoading: true });
        setModalOpen(false);

        try {

            const address = `${generateUsername(4)}@${domains[0].domain}`;
            const password = generatePassword(7);

            const { data } = await createAccount(address, password)

            setUser({ address: data?.address, password });

        } catch (error) { console.error("error") }

        finally {
            setStatus({ isLoading: false });
            setModalOpen(true);
        }

    }

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

    return (
        <>
            <Button
                disabled={status.isLoading}
                onClick={handleGenerateEmail}
                variant="outline"
                type="button"
                className="w-full cursor-pointer"
            >
                {status.isLoading ? (
                    <Loader2Icon className="animate-spin" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                            fill="currentColor"
                        />
                    </svg>
                )}
                <span>{status.isLoading ? "Generating..." : "Generate Email"}</span>
            </Button>

            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Generated Email"
                description="Here are your email credentials"
                content={() => (
                    <form className='flex flex-col gap-4'>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="pl-2">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="text"
                                    value={user?.address}
                                    disabled
                                    readOnly
                                    className="pe-9"
                                />
                                <button
                                    type="button"
                                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                                    onClick={() => copyToClipboard(user?.address)}
                                    aria-label="Copy email"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="pl-2">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    value={user?.password}
                                    disabled
                                    readOnly
                                    type={isVisible ? "text" : "password"}
                                    className="pe-[72px]"
                                />
                                <button
                                    className="absolute right-9 inset-y-0 w-9 flex items-center justify-center"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={isVisible ? "Hide password" : "Show password"}
                                >
                                    {isVisible ? (
                                        <EyeOffIcon size={16} />
                                    ) : (
                                        <EyeIcon size={16} />
                                    )}
                                </button>

                                <button
                                    className="absolute right-0 inset-y-0 w-9 flex items-center justify-center"
                                    type="button"
                                    onClick={() => copyToClipboard(user?.password)}
                                    aria-label="Copy password"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-md border border-blue-500/50 px-4 py-3 text-blue-600">
                            <p className="text-sm">
                                <InfoIcon
                                    className="me-3 -mt-0.5 inline-flex opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Please save these credentials securely in order to use them later.
                            </p>
                        </div>

                    </form>
                )}
            >
                <span></span>
            </Modal>
        </>
    );
};

export { GenerateEmailButton };
