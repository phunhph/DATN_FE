// LineChartComponent.tsx
import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

// Register necessary Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface LineChartProps {
    data: { score: number; students: number }[];
}

const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<'line'> | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Line chart configuration
            const chartConfig: ChartConfiguration<'line'> = {
                type: 'line',
                data: {
                    labels: data.map((item) => item.score.toString()), // X-axis: Scores
                    datasets: [
                        {
                            label: 'Số sinh viên',
                            data: data.map((item) => item.students), // Y-axis: Students
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            pointBackgroundColor: 'rgba(75,192,192,1)',
                            pointBorderColor: '#fff',
                            tension: 0.3, // Curve the line
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
                            text: 'Biểu đồ thống kê thang điểm',
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) =>
                                    `Số lượng SV: ${tooltipItem.raw}`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Điểm số',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Students',
                            },
                        },
                    },
                },
            };

            // Create the Line chart instance
            chartInstance.current = new Chart(canvasRef.current, chartConfig);
        }

        // Cleanup on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas id='linechart' ref={canvasRef} />;
};

export default LineChartComponent;
