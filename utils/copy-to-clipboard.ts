import { toast } from 'sonner';

export async function copyToClipboard(value: string) {

    try {

        await navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard!');

    } catch { toast.error('Failed to copy!') }

}
