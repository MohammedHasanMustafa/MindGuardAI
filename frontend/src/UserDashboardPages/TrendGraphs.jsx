import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const generateMockSocialData = () => {
  const data = [];
  const platforms = ['twitter', 'facebook', 'instagram'];
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    platforms.forEach(platform => {
      // Generate random but somewhat realistic trends
      const baseSentiment = 50 + Math.sin(i/7) * 20 + Math.random() * 10;
      const baseDisorder = 30 + Math.cos(i/10) * 15 + Math.random() * 10;
      
      // Risk level based on disorder and sentiment
      let risk;
      if (baseDisorder > 50 || baseSentiment < 40) {
        risk = 'High';
      } else if (baseDisorder > 35 || baseSentiment < 50) {
        risk = 'Moderate';
      } else {
        risk = 'Low';
      }
      
      // Platform-specific variations
      let platformModifier = 1;
      if (platform === 'twitter') platformModifier = 0.9; // Twitter tends more negative
      if (platform === 'instagram') platformModifier = 1.1; // Instagram tends more positive
      
      data.push({
        date: date.toISOString(),
        platform,
        sentiment_confidence: Math.max(0, Math.min(100, 
          baseSentiment * platformModifier + (Math.random() * 10 - 5)
        )),
        disorder_confidence: Math.max(0, Math.min(100, 
          baseDisorder * (1/platformModifier) + (Math.random() * 10 - 5)
        )),
        risk,
        notes: `Sample ${platform} data point on ${date.toLocaleDateString()}`
      });
    });
  }
  return data;
};

const TrendGraphs = () => {
  const [trendData, setTrendData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("sentiment");
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [highRiskDetected, setHighRiskDetected] = useState(false);

  // Time range options
  const timeRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  // Platform options
  const platformOptions = [
    { value: "all", label: "All Platforms" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "mindguard", label: "Mindguard" }
  ];

  // Chart type options
  const chartTypes = [
    { value: "line", label: "Line Chart" },
    { value: "bar", label: "Bar Chart" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTrendData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real Mindguard data
        const response = await axios.get(`http://localhost:4000/api/chatbot/trends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Generate mock social data
        const mockSocialData = generateMockSocialData();
        
        // Combine real Mindguard data with mock social data
        const combinedData = [
          ...response.data.trendData.map(item => ({ ...item, platform: 'mindguard' })),
          ...mockSocialData
        ];
        
        setTrendData(combinedData);
        filterData(combinedData, timeRange, platformFilter);
        
        // Check for high risk in latest data (from both sources)
        const latestMindguard = response.data.trendData[response.data.trendData.length - 1];
        const latestSocial = mockSocialData[mockSocialData.length - 1];
        
        if (latestMindguard?.risk === "High" || latestSocial?.risk === "High") {
          setHighRiskDetected(true);
        }
      } catch (error) {
        console.error("Error fetching trend data:", error);
        // Fallback to mock data only if API fails
        const mockSocialData = generateMockSocialData();
        setTrendData(mockSocialData);
        filterData(mockSocialData, timeRange, platformFilter);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();

    const interval = setInterval(fetchTrendData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filterData = (data, range, platform) => {
    let filtered = [...data];
    
    // Filter by platform if not 'all'
    if (platform !== "all") {
      filtered = filtered.filter(item => item.platform?.toLowerCase() === platform);
    }
    
    // Filter by time range
    const now = new Date();
    switch (range) {
      case "7days":
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(item => new Date(item.date) >= sevenDaysAgo);
        break;
      case "30days":
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filtered = filtered.filter(item => new Date(item.date) >= thirtyDaysAgo);
        break;
      case "90days":
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        filtered = filtered.filter(item => new Date(item.date) >= ninetyDaysAgo);
        break;
      case "custom":
        if (startDate && endDate) {
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        break;
      default:
        break;
    }
    
    setFilteredData(filtered);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    filterData(trendData, range, platformFilter);
  };

  const handlePlatformChange = (platform) => {
    setPlatformFilter(platform);
    filterData(trendData, timeRange, platform);
  };

  const calculateMovingAverage = (data, windowSize = 7) => {
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
    
    const sentimentChange = last.sentiment_confidence - first.sentiment_confidence;
    const riskChange = riskLevelMapping[last.risk] - riskLevelMapping[first.risk];
    
    let summaryParts = [];
    
    if (sentimentChange > 5) summaryParts.push(`Your sentiment improved by ${Math.abs(sentimentChange).toFixed(1)}%`);
    else if (sentimentChange < -5) summaryParts.push(`Your sentiment declined by ${Math.abs(sentimentChange).toFixed(1)}%`);
    
    if (riskChange > 0) summaryParts.push(`risk level increased from ${first.risk} to ${last.risk}`);
    else if (riskChange < 0) summaryParts.push(`risk level decreased from ${first.risk} to ${last.risk}`);
    
    if (summaryParts.length === 0) return "Your metrics have remained relatively stable during this period";
    
    return `During this period, ${summaryParts.join(" and ")}.`;
  };

  const riskLevelMapping = { Low: 20, Moderate: 50, High: 80 };
  const riskThresholds = {
    y: [
      { value: 0, color: "rgba(46, 204, 113, 0.1)" },    // Green for low risk
      { value: 50, color: "rgba(241, 196, 15, 0.1)" },  // Yellow for moderate risk
      { value: 80, color: "rgba(231, 76, 60, 0.1)" },   // Red for high risk
    ]
  };

  const labels = filteredData.map(item =>
    new Date(item.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })
  );

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
        intersect: false
      },
      annotation: {
        annotations: riskThresholds
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
          // For bar charts, we might need to adjust the max rotation
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
  const sentimentValues = filteredData.map(item => item.sentiment_confidence);
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
        label: "7-Day Average",
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
  const disorderValues = filteredData.map(item => item.disorder_confidence);
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
        label: "7-Day Average",
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
  const riskValues = filteredData.map(item => riskLevelMapping[item.risk] || 0);
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
        label: "7-Day Average",
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
    
    const chartProps = {
      data,
      options: chartOptions
    };
    
    return chartType === "bar" ? (
      <Bar {...chartProps} />
    ) : (
      <Line {...chartProps} />
    );
  };

  const getTrendInsight = () => {
    if (filteredData.length === 0) return null;
    
    const latest = filteredData[filteredData.length - 1];
    const prev = filteredData.length > 1 ? filteredData[filteredData.length - 2] : null;
    
    let sentimentChange = null;
    if (prev) {
      sentimentChange = latest.sentiment_confidence - prev.sentiment_confidence;
    }
    
    return (
      <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 mb-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2">Latest Insights</h3>
        <p className="mb-1">
          <span className="font-medium">Current Risk Level:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-white ${
            latest.risk === 'High' ? 'bg-red-500' : 
            latest.risk === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
          }`}>
            {latest.risk}
            {latest.risk === 'High' && (
              <span className="ml-2 inline-flex relative">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
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
        <p className="text-sm text-gray-600 mt-2">
          Last updated: {new Date(latest.date).toLocaleString()}
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
            Your Mental Health Trends
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
                    filterData(trendData, "custom", platformFilter);
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="border rounded px-2 py-1"
                />
                <span>to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    filterData(trendData, "custom", platformFilter);
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="border rounded px-2 py-1"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <select
                value={platformFilter}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="border rounded px-2 py-1 bg-white"
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>

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
                  {renderChart()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Tooltips */}
      <ReactTooltip id="sentiment-tooltip" place="top" effect="solid">
        Measures positivity/negativity in your conversations
      </ReactTooltip>
      <ReactTooltip id="disorder-tooltip" place="top" effect="solid">
        Indicates potential mental health disorder patterns
      </ReactTooltip>
      <ReactTooltip id="risk-tooltip" place="top" effect="solid">
        Shows your overall mental health risk assessment
      </ReactTooltip>
    </div>
  );
};

export default TrendGraphs;
