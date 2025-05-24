import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const TrendGraphs = () => {
  const [trendData, setTrendData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("sentiment");
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1day");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [highRiskDetected, setHighRiskDetected] = useState(false);

  const timeRanges = [
    { value: "1day", label: "Last 24 Hours" },
    { value: "3days", label: "Last 3 Days" },
    { value: "7days", label: "Last 7 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  const chartTypes = [
    { value: "line", label: "Line Chart" },
    { value: "bar", label: "Bar Chart" },
  ];

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/chatbot/trend-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Transform the API data to match our expected format
        const transformedData = response.data.trendData.map(item => ({
          id: item.id,
          timestamp: item.timestamp,
          sentiment: item.sentiment,
          sentimentConfidence: item.sentimentConfidence,
          disorder: item.disorder,
          disorderConfidence: item.disorderConfidence,
          riskLevel: item.riskLevel
        }));
        
        setTrendData(transformedData);
        filterData(transformedData, timeRange);
        
        // Check for high risk in latest data
        if (transformedData.length > 0) {
          const latest = transformedData[transformedData.length - 1];
          if (latest.riskLevel === "High Risk") {
            setHighRiskDetected(true);
          }
        }
      } catch (error) {
        console.error("Error fetching trend data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();

    const interval = setInterval(fetchTrendData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filterData = (data, range) => {
    let filtered = [...data];
    
    const now = new Date();
    switch (range) {
      case "1day":
        const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
        filtered = filtered.filter(item => new Date(item.timestamp) >= oneDayAgo);
        break;
      case "3days":
        const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
        filtered = filtered.filter(item => new Date(item.timestamp) >= threeDaysAgo);
        break;
      case "7days":
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(item => new Date(item.timestamp) >= sevenDaysAgo);
        break;
      case "custom":
        if (startDate && endDate) {
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        break;
      default:
        break;
    }
    
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setFilteredData(filtered);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    filterData(trendData, range);
  };

  const calculateMovingAverage = (data, windowSize = 3) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const subset = data.slice(start, index + 1);
      const sum = subset.reduce((acc, val) => acc + val, 0);
      return sum / subset.length;
    });
  };

  const generateSummary = () => {
    if (filteredData.length < 2) return "Not enough data to generate summary";
    
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    
    const sentimentChange = last.sentimentConfidence - first.sentimentConfidence;
    const disorderChange = last.disorderConfidence - first.disorderConfidence;
    
    let summaryParts = [];
    
    if (sentimentChange > 5) summaryParts.push(`sentiment improved by ${Math.abs(sentimentChange).toFixed(1)}%`);
    else if (sentimentChange < -5) summaryParts.push(`sentiment declined by ${Math.abs(sentimentChange).toFixed(1)}%`);
    
    if (disorderChange > 5) summaryParts.push(`disorder confidence increased by ${Math.abs(disorderChange).toFixed(1)}%`);
    else if (disorderChange < -5) summaryParts.push(`disorder confidence decreased by ${Math.abs(disorderChange).toFixed(1)}%`);
    
    if (summaryParts.length === 0) return "Your metrics have remained relatively stable during this period";
    
    return `During this period, your ${summaryParts.join(" and ")}.`;
  };

  const riskLevelMapping = { 
    "No Risk": 0, 
    "Low Risk": 30, 
    "Moderate Risk": 60, 
    "High Risk": 90 
  };

  const generateChartLabels = () => {
    if (!filteredData.length) return [];
    
    if (timeRange === "1day") {
      return filteredData.map(item =>
        new Date(item.timestamp).toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true 
        })
      );
    } else {
      return filteredData.map(item =>
        new Date(item.timestamp).toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true
        })
      );
    }
  };

  const labels = generateChartLabels();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          },
          afterLabel: function(context) {
            const dataItem = filteredData[context.dataIndex];
            if (activeTab === "sentiment") {
              return `Sentiment: ${dataItem.sentiment}`;
            } else if (activeTab === "disorder") {
              return `Disorder: ${dataItem.disorder}`;
            } else if (activeTab === "risk") {
              return `Risk: ${dataItem.riskLevel}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 12
          },
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: 'white',
        borderWidth: 2
      },
      line: {
        tension: 0.3,
        borderWidth: 3
      },
      bar: {
        borderRadius: 4,
        borderSkipped: false,
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    }
  };

  // Sentiment data with moving average
  const sentimentValues = filteredData.map(item => item.sentimentConfidence);
  const sentimentData = {
    labels,
    datasets: [
      {
        label: "Sentiment Confidence",
        data: sentimentValues,
        borderColor: "rgba(46, 204, 113, 0.8)",
        backgroundColor: "rgba(46, 204, 113, 0.5)",
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(46, 204, 113, 1)",
      },
      {
        label: "3-Day Average",
        data: calculateMovingAverage(sentimentValues),
        borderColor: "rgba(41, 128, 185, 0.8)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ],
  };

  // Disorder data with moving average
  const disorderValues = filteredData.map(item => item.disorderConfidence);
  const disorderData = {
    labels,
    datasets: [
      {
        label: "Disorder Confidence",
        data: disorderValues,
        borderColor: "rgba(241, 196, 15, 0.8)",
        backgroundColor: "rgba(241, 196, 15, 0.5)",
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(241, 196, 15, 1)",
      },
      {
        label: "3-Day Average",
        data: calculateMovingAverage(disorderValues),
        borderColor: "rgba(211, 84, 0, 0.8)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ],
  };

  // Risk data with moving average
  const riskValues = filteredData.map(item => riskLevelMapping[item.riskLevel] || 0);
  const riskData = {
    labels,
    datasets: [
      {
        label: "Risk Level",
        data: riskValues,
        borderColor: "rgba(231, 76, 60, 0.8)",
        backgroundColor: "rgba(231, 76, 60, 0.5)",
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(231, 76, 60, 1)",
      },
      {
        label: "3-Day Average",
        data: calculateMovingAverage(riskValues),
        borderColor: "rgba(192, 57, 43, 0.8)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ],
  };

  const renderChart = () => {
    const data = {
      sentiment: sentimentData,
      disorder: disorderData,
      risk: riskData
    }[activeTab];
    
    return chartType === "bar" ? (
      <Bar data={data} options={chartOptions} />
    ) : (
      <Line data={data} options={chartOptions} />
    );
  };

  const getTrendInsight = () => {
    if (filteredData.length === 0) return null;
    
    const latest = filteredData[filteredData.length - 1];
    const prev = filteredData.length > 1 ? filteredData[filteredData.length - 2] : null;
    
    let sentimentChange = null;
    let disorderChange = null;
    if (prev) {
      sentimentChange = latest.sentimentConfidence - prev.sentimentConfidence;
      disorderChange = latest.disorderConfidence - prev.disorderConfidence;
    }
    
    return (
      <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 mb-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2">Latest Insights</h3>
        <p className="mb-1">
          <span className="font-medium">Current Risk Level:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-white ${
            latest.riskLevel === 'High Risk' ? 'bg-red-500' : 
            latest.riskLevel === 'Moderate Risk' ? 'bg-yellow-500' : 
            latest.riskLevel === 'Low Risk' ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {latest.riskLevel}
            {latest.riskLevel === 'High Risk' && (
              <span className="ml-2 inline-flex relative">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </span>
        </p>
        <p className="mb-1">
          <span className="font-medium">Current Sentiment:</span> 
          <span className={`ml-2 ${
            latest.sentiment === 'Positive' ? 'text-green-600' : 
            latest.sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {latest.sentiment} ({latest.sentimentConfidence.toFixed(1)}%)
          </span>
        </p>
        <p className="mb-1">
          <span className="font-medium">Detected Disorder:</span> 
          <span className="ml-2 font-medium">
            {latest.disorder} ({latest.disorderConfidence.toFixed(1)}%)
          </span>
        </p>
        {sentimentChange !== null && (
          <p className="mb-1">
            <span className="font-medium">Sentiment Change:</span> 
            <span className={`ml-2 ${sentimentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sentimentChange >= 0 ? '↑' : '↓'} {Math.abs(sentimentChange).toFixed(1)}%
            </span>
          </p>
        )}
        {disorderChange !== null && (
          <p className="mb-1">
            <span className="font-medium">Disorder Confidence Change:</span> 
            <span className={`ml-2 ${disorderChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {disorderChange >= 0 ? '↑' : '↓'} {Math.abs(disorderChange).toFixed(1)}%
            </span>
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Last updated: {new Date(latest.timestamp).toLocaleString()}
        </p>
        <p className="mt-2 text-sm font-medium">
          Summary: {generateSummary()}
        </p>
      </div>
    );
  };

  const healthRecommendations = [
    "Consider scheduling a check-in with a mental health professional",
    "Practice mindfulness exercises for 10 minutes daily",
    "Reach out to friends or family for support",
    "Maintain a regular sleep schedule",
    "Engage in physical activity, even just a short walk",
    "Limit social media use if it's affecting your mood",
    "Try journaling to process your thoughts and feelings"
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Mindguard Mental Health Trends
          </h2>
          {highRiskDetected && (
            <button 
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              {showRecommendations ? "Hide Recommendations" : "Show Recommendations"}
            </button>
          )}
        </div>

        {showRecommendations && (
          <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-5 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-red-600">
              <span className="inline-flex relative mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Health Recommendations
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {healthRecommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-5 mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    timeRange === range.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleTimeRangeChange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {timeRange === "custom" && (
              <div className="flex space-x-2 items-center">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    filterData(trendData, "custom");
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="border rounded px-2 py-1"
                  maxDate={new Date()}
                />
                <span>to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    filterData(trendData, "custom");
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  placeholderText="End Date"
                  className="border rounded px-2 py-1"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border rounded px-2 py-1 bg-white"
              >
                {chartTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {getTrendInsight()}
              
              <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-5 mb-8">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
                      activeTab === "sentiment"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("sentiment")}
                    data-tooltip-id="sentiment-tooltip"
                  >
                    Sentiment
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
                      activeTab === "disorder"
                        ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("disorder")}
                    data-tooltip-id="disorder-tooltip"
                  >
                    Disorder
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
                      activeTab === "risk"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("risk")}
                    data-tooltip-id="risk-tooltip"
                  >
                    Risk Level
                  </button>
                </div>
                <div className="p-5 h-96">
                  {filteredData.length > 0 ? (
                    renderChart()
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      No data available for the selected time range
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ReactTooltip id="sentiment-tooltip" place="top" effect="solid">
        Measures positivity/negativity in your conversations (0-100%)
      </ReactTooltip>
      <ReactTooltip id="disorder-tooltip" place="top" effect="solid">
        Confidence level for detected mental health patterns (0-100%)
      </ReactTooltip>
      <ReactTooltip id="risk-tooltip" place="top" effect="solid">
        Overall mental health risk assessment based on analysis
      </ReactTooltip>
    </div>
  );
};

export default TrendGraphs;
