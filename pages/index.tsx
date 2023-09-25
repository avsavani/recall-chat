import { MainLayout } from "@/components/landing-page/landing-layout";
import { Hero } from "@/components/landing-page/Hero";
import { StarField } from "@/components/starfield";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
  

    return (
        <>
            <MainLayout>
                <Hero />
            </MainLayout>
        </>
    )
}
