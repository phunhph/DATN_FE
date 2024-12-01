// BarChartComponent.tsx
import { useEffect, useRef } from 'react';
import {
    Chart,
    ChartConfiguration,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        semester: string; // Semester name (e.g., "Spring 2024")
        passed: number; // Number of students who passed
        notPassed: number; // Number of students who did not pass
    }[];
    id:string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ data,id }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<'bar'> | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Bar chart configuration
            const chartConfig: ChartConfiguration<'bar'> = {
                type: 'bar',
                data: {
                    labels: data.map((item) => item.semester), // X-axis: Semester names
                    datasets: [
                        {
                            label: 'Đã vượt',
                            data: data.map((item) => item.passed),
                            backgroundColor: 'rgba(75, 192, 192, 0.7)', // Color for passed students
                        },
                        {
                            label: 'Không đạt',
                            data: data.map((item) => item.notPassed),
                            backgroundColor: 'rgba(255, 99, 132, 0.7)', // Color for not passed students
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Kết quả thi của các kỳ',
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Kỳ học',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Số lượng thí sinh',
                            },
                            ticks: {
                                stepSize: 10, // Adjust the step size as needed
                            },
                        },
                    },
                },
            };

            // Create the Bar chart instance
            chartInstance.current = new Chart(canvasRef.current, chartConfig);
        }

        // Cleanup on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas id={id} ref={canvasRef} />;
};

export default BarChartComponent;
