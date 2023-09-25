// hooks/useFileProgress.tsx
import { useState } from "react";

export const useFileProgress = () => {
    const [fileProgress, setFileProgress] = useState<{ [key: string]: number }>({});

    const simulateFileProgress = (fileName: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 1; // Random increment between 1 and 10
            if (progress >= 100) {
                clearInterval(interval);
                progress = 100;
            }
            setFileProgress((prevState) => ({ ...prevState, [fileName]: progress }));
        }, 500);
    };

    const updateFileProgress = (fileName: string, progress: number) => {
        setFileProgress((prevState) => ({ ...prevState, [fileName]: progress }));
    };

    type PROGRESSRING = {
        stroke: number;
        radius: number;
        progress: number;
        percent: number
    }

    function ProgressRing({ stroke, radius, progress, percent }: PROGRESSRING) {
        const normalizedRadius = radius - stroke * 2
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - progress / 100 * circumference;

        return (
            <div className="flex items-center self-center justify-center overflow-hidden rounded-full">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                >
                    <circle
                        stroke="#E5E7EB"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        stroke-width={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="#7C3AED"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        stroke-width={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <span className="absolute text-xl font-semibold text-gray-600">{percent}%</span>
            </div>
        )
    }


    return { fileProgress, simulateFileProgress, updateFileProgress, ProgressRing };
};

