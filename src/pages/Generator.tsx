import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CursorEffect from "@/components/CursorEffect";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import GeneratorSection from "@/components/GeneratorSection";
import ParticleField from "@/components/ParticleField";
import { usePromptStore } from "@/store/promptStore";

const Generator = () => {
    const [searchParams] = useSearchParams();
    const setCategory = usePromptStore((s) => s.setCategory);

    useEffect(() => {
        const cat = searchParams.get("cat");
        if (cat) {
            setCategory(cat);
        }
    }, [searchParams, setCategory]);

    return (
        <>
            <ParticleField />
            <div className="grid-lines scanlines-blue"></div>
            <div className="orb orb-red-topleft"></div>
            <div className="orb orb-blue-bottomleft"></div>
            <CursorEffect />
            <ProgressBar />
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
                <GeneratorSection />
            </main>
        </>
    );
};

export default Generator;
