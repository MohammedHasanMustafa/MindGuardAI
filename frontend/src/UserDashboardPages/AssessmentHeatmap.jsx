import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";

Chart.register(...registerables);

const AssessmentHeatmap = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("week");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAssessmentData = async () => {
      try {
        const response = await axios.get(
          `https://mindguardaibackend.onrender.com//api/assessment/time-period?timePeriod=${timePeriod}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const flatAssessments = response.data.data.flatMap(item => item.assessments);
        setAssessmentData(flatAssessments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [timePeriod]);

  const handleTimePeriodChange = (e) => {
    setLoading(true);
    setTimePeriod(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-700">Loading trends...</div>
      </div>
    );
  }

  const labels = assessmentData.map(item =>
    new Date(item.timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })
  );

  const phq9Data = assessmentData.map(item => item.phq9.reduce((sum, value) => sum + value, 0));
  const gad7Data = assessmentData.map(item => item.gad7.reduce((sum, value) => sum + value, 0));
  const moodData = assessmentData.map(item => item.mood);
  const sleepData = assessmentData.map(item => item.sleep);
  const energyData = assessmentData.map(item => item.energy);
  const appetiteData = assessmentData.map(item => item.appetite);
  const socialData = assessmentData.map(item => item.social);

  const createDataset = (label, data, color) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: `${color}33`,
    fill: true,
  });

  const generateChartData = (label, data, color) => ({
    labels,
    datasets: [createDataset(label, data, color)],
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Your Self Assessment Trends</h1>

      <div className="flex justify-center mb-6">
        <label className="mr-3 text-lg font-medium text-gray-700">Time Period:</label>
        <select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="border border-gray-300 rounded px-3 py-1 text-gray-800"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <ChartCard title="PHQ-9 Score Trend" chartData={generateChartData("PHQ-9 Score", phq9Data, "rgba(0, 200, 0, 0.8)")} />
        <ChartCard title="GAD-7 Score Trend" chartData={generateChartData("GAD-7 Score", gad7Data, "rgba(255, 165, 0, 0.8)")} />
        <ChartCard title="Mood Trend" chartData={generateChartData("Mood", moodData, "rgba(100, 100, 255, 0.8)")} />
        <ChartCard title="Sleep Trend" chartData={generateChartData("Sleep", sleepData, "rgba(255, 99, 132, 0.8)")} />
        <ChartCard title="Energy Trend" chartData={generateChartData("Energy", energyData, "rgba(54, 162, 235, 0.8)")} />
        <ChartCard title="Appetite Trend" chartData={generateChartData("Appetite", appetiteData, "rgba(153, 102, 255, 0.8)")} />
        <ChartCard title="Social Interaction Trend" chartData={generateChartData("Social", socialData, "rgba(255, 159, 64, 0.8)")} />
      </div>
    </div>
  );
};

const ChartCard = ({ title, chartData }) => (
  <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-5">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <Line data={chartData} />
  </div>
);

export default AssessmentHeatmap;
