import { useSignIn } from "@clerk/nextjs";

export default function SignInStep() {
    const { isLoaded, signIn } = useSignIn();

    if (!isLoaded) {
        // handle loading state
        return null;
    }

    return <div>The current sign in attempt status is {signIn.status}.</div>;
}