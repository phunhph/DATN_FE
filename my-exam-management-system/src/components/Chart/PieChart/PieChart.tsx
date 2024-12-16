// PieChartComponent.tsx
import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: { label: string; percentage: number }[];
    id: string;
    title: string;
}

const generateColors = (numColors: any) => {
    const predefinedColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    // If there are more data points than predefined colors, repeat the colors
    return Array.from({ length: numColors }, (_, i) => predefinedColors[i % predefinedColors.length]);
};

const PieChartComponent: React.FC<PieChartProps> = ({ data, id, title }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<'pie'> | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // If a chart instance already exists, destroy it before creating a new one
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Chart.js configuration object with proper typing
            const chartConfig: ChartConfiguration<'pie'> = {
                type: 'pie',
                data: {
                    labels: data.map((item) => item.label),
                    datasets: [
                        {
                            data: data.map((item) => item.percentage),
                            backgroundColor: generateColors(data.length),
                            hoverBackgroundColor: generateColors(data.length),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: title
                        },
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) =>
                                    `${tooltipItem.label}: ${tooltipItem.raw}%`,
                            },
                        },
                    },
                },
            };

            // Create a new Pie Chart
            chartInstance.current = new Chart(canvasRef.current, chartConfig);
        }

        // Cleanup the chart instance on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas id={id} ref={canvasRef} />;
};

export default PieChartComponent;
