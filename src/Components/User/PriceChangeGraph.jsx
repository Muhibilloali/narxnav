import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChangeGraph = () => {
  const { t, i18n } = useTranslation(); // Move this line to the top
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup chart instance on component unmount
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    labels: [t("yanvar"), t("fevral"), t("mart"), t("aprel"), t("may"), t("iyun"),],
    datasets: [
      {
        label: t("price"), // Now `t` is properly initialized
        data: [65, 59, 80, 81, 56, 75],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)"
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
    window.location.reload();
  };

  return (
    <div className="border rounded-lg shadow-gray-900 border-gray-700 w-96  h-56 mt-2 p-2">
      <div onClick={() => setModalIsOpen(true)} className="cursor-pointer">
        {/* <div className="text-blue-500 mt-2">{t("narxning-ozgarishi")}</div> */}
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Price Analysis"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
        overlayClassName=""
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl mb-4">{t("narxning-diogrammasi")}</h2>
          <Line ref={chartRef} data={data} options={options} />
          <button
            onClick={() => setModalIsOpen(false)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {t("yopish")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PriceChangeGraph;
