import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ToolTip from "./ToolTip";
import axiosInstance from "../../../../components/utils/AxiosIntance";
import "./Graph.css";

function LineChart({ months, year }) {
  const [tooltipModel, setTooltipModel] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [dateLabels, setDateLabels] = useState([]);
  const [presentCounts, setPresentCounts] = useState([]);
  const [absentCounts, setAbsentCounts] = useState([]);
  const [leavecounts,setleavecounts]=useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/user/graphuser?month=${months}&year=${year}`);
        setUserCount(response.data.userCount);
        setDateLabels(response.data.dateLabels);
        setPresentCounts(response.data.presentCounts);
        setAbsentCounts(response.data.absentCounts);
        setleavecounts(response.data.leaveCounts)
        
        console.log(response.data.dateLabels);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, [months, year]);

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "Present Count",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "green",
        borderColor: "green",
        data: presentCounts,
      },
      {
        label: "Leave", 
        fill: false,
        lineTension: 0.3,
        backgroundColor: "yellow",
        borderColor: "yellow",
        data:leavecounts, 
      },
      {
        label: "Absent Count",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "#f84c1e",
        borderColor: "#f84c1e",
        data: absentCounts,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: userCount,
        ticks: {
          stepSize: 1,
        },
        grid: {
          drawTicks: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        enabled: false,
        custom: function (tooltipModel) {
          setTooltipModel(tooltipModel);
          if (tooltipModel.opacity === 0) {
            setShowTooltip(false);
            return;
          }
          setShowTooltip(true);
          setPosition(this._chart.canvas.getBoundingClientRect());
        },
      },
    },
  };

  return (
    <div className="GraphMain">
      <h2>Attendance Graph</h2>
      <Line options={options} data={data} />
      {tooltipModel.dataPoints && tooltipModel.dataPoints.map((tooltip, index) => (
        <ToolTip
          key={index}
          data={tooltip}
          isShow={showTooltip}
          position={position}
          color={tooltipModel.labelColors[index].borderColor}
        />
      ))}
    </div>
  );
}

export default LineChart;
