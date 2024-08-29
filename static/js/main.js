let priceChart;

// DOM 元素載入完成
document.addEventListener("DOMContentLoaded", () => {
  demo();
  // updatePriceTrendChart(10000000);
});

const demo = () => {
  document.getElementById("house_age").value = "20";
  document.getElementById("area_ping").value = "26";
  document.getElementById("elevator").value = "有";
  document.getElementById("manager").value = "有";
  document.getElementById("parking_spaces").value = "無";
  document.getElementById("floor").value = "1";
  document.getElementById("total_floors").value = "0";
  document.getElementById("rooms").value = "2";
  document.getElementById("living_rooms").value = "1";
  document.getElementById("bathrooms").value = "1";
  document.getElementById("building_type").value = "2";
  document.getElementById("usage").value = "2";
  document.getElementById("predicted_year").value = "111";
}

const predictPrice = () => {
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "輸入資料異常",
      text: "請填寫所有必填欄位",
    });
    return;
  }

  // 載入動畫
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  // 變更載入動畫為顯示
  loading.style.display = "block";
  // 載入訊息
  result.textContent = "";

  // 下拉式選單 to OneHotEncoding 判斷陣列
  const building_type_array = building_type2onehot(document.getElementById("building_type").value);
  const usage_array = usage2onehot(document.getElementById("usage").value);
  const inputData = {
    house_age: document.getElementById("house_age").value,
    area_ping: document.getElementById("area_ping").value,
    elevator: document.getElementById("elevator").value,
    manager: document.getElementById("manager").value,
    parking_spaces: document.getElementById("parking_spaces").value,
    floor: document.getElementById("floor").value,
    total_floors: document.getElementById("total_floors").value,
    rooms: document.getElementById("rooms").value,
    living_rooms: document.getElementById("living_rooms").value,
    bathrooms: document.getElementById("bathrooms").value,
    building_type: document.getElementById("building_type").value,
    usage: document.getElementById("usage").value,
    predicted_year: document.getElementById("predicted_year").value,
  };

  console.log(usage_array)
  console.log(building_type_array)

  console.log(inputData);

  // 後端通訊
  axios
    .get("/test", {
      params: {
        longitude: 120.6624,
        latitude: 24.1208,
        age: inputData.house_age,
        pin: inputData.area_ping,
        lift: inputData.elevator,
        security: inputData.manager,
        parkinglot: inputData.parking_spaces,
        year: inputData.predicted_year, 
        floor_level: inputData.floor,
        total_floor: inputData.total_floors,
        room: inputData.rooms,
        livingroom: inputData.living_rooms,
        bathroom: inputData.bathrooms,
        building_type: building_type_array.building_type, // 
        apartment: building_type_array.apartment,
        suite: building_type_array.suite,
        Huaxia: building_type_array.Huaxia,
        House: building_type_array.House,
        commercial_use: usage_array.commercial_use,
        residential_use: usage_array.residential_use,
        business_use: 0, // 
        office_use: 0, // 
        district: 1, // 
      },
    })
    .then(function (response) {
      // 取得回應後
      console.log(response.data);

      // 顯示預測房價
      const formattedPrice = new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(response.data.predict_price);
      loading.style.display = 'none';
      result.innerHTML = `預測房價: <span style="color: #64ffda; font-size: 1.2em;">${formattedPrice} 萬</span>`;

      // 預計單價
      const unitPrice = (response.data.predict_price / inputData.area_ping ).toFixed(2);
      document.getElementById('unit_price').textContent = `${unitPrice} 萬/坪`;

      // 填入貸款價格
      document.getElementById('loan_amount').value = Math.round(response.data.predict_price)

      // Update price trend chart
      updatePriceTrendChart(response.data.predict_price * 10000);

    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};

// "建物類型"下拉式選單轉 0/1 編碼函數
const building_type2onehot = (dropdown_buildtype) => {
  let building_type_array = {};
  switch (dropdown_buildtype) {
    case "1":
      building_type_array.building_type = "1";
      building_type_array.apartment = "0";
      building_type_array.suite = "0";
      building_type_array.Huaxia = "0";
      building_type_array.House = "0";
      break;

    case "2":
      building_type_array.building_type = "0";
      building_type_array.apartment = "1";
      building_type_array.suite = "0";
      building_type_array.Huaxia = "0";
      building_type_array.House = "0";
      break;
    case "3":
      building_type_array.building_type = "0";
      building_type_array.apartment = "0";
      building_type_array.suite = "1";
      building_type_array.Huaxia = "0";
      building_type_array.House = "0";
      break;
    case "4":
      building_type_array.building_type = "0";
      building_type_array.apartment = "0";
      building_type_array.suite = "0";
      building_type_array.Huaxia = "1";
      building_type_array.House = "0";
      break;
    case "5":
      building_type_array.building_type = "0";
      building_type_array.apartment = "0";
      building_type_array.suite = "0";
      building_type_array.Huaxia = "0";
      building_type_array.House = "1";
      break;
    default:
      building_type_array.building_type = "0";
      building_type_array.apartment = "0";
      building_type_array.suite = "0";
      building_type_array.Huaxia = "0";
      building_type_array.House = "0";
      break;
  }

  return building_type_array;
};

// "用途"下拉式選單轉 0/1 編碼函數
const usage2onehot = (usage) => {
  let usage_array = {};
  switch (usage) {
    case "1":
      usage_array.commercial_use = "1";
      usage_array.residential_use = "0";
      usage_array.business_use = "0";
      usage_array.office_use = "0";
      break;
    case "2":
      usage_array.commercial_use = "0";
      usage_array.residential_use = "1";
      usage_array.business_use = "0";
      usage_array.office_use = "0";
      break;
    case "3":
      usage_array.commercial_use = "0";
      usage_array.residential_use = "0";
      usage_array.business_use = "1";
      usage_array.office_use = "0";
      break;
    case "4":
      usage_array.commercial_use = "0";
      usage_array.residential_use = "0";
      usage_array.business_use = "0";
      usage_array.office_use = "1";
      break;

    default:
      usage_array.commercial_use = "0";
      usage_array.residential_use = "0";
      usage_array.business_use = "0";
      usage_array.office_use = "0";
      break;
  }
  return usage_array;
};

// 表單驗證
const validateForm = () => {
  const rooms = document.getElementById("rooms").value;
  const predictedYear = document.getElementById("predicted_year").value;
  return rooms !== "" && predictedYear !== "";
};


// 計算貸款
const calculateMortgage = () => {
  const loanAmount = parseFloat(document.getElementById('loan_amount').value) * 10000; // Convert from 萬 to 元
  const loanYears = parseFloat(document.getElementById('loan_years').value);
  const interestRate = parseFloat(document.getElementById('interest_rate').value) / 100 / 12;
  const totalPayments = loanYears * 12;

  if (loanAmount && loanYears && interestRate) {
    const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, totalPayments)) / (Math.pow(1 + interestRate, totalPayments) - 1);
    const formattedPayment = new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(monthlyPayment);
    document.getElementById('mortgage_result').innerHTML = `每月還款: <span style="color: #64ffda;">${formattedPayment}</span>`;
  } else {
    document.getElementById('mortgage_result').textContent = '請輸入完整的貸款信息';
  }
}

const focusNext = (event, nextFieldId) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const nextElement = document.getElementById(nextFieldId);
    if (nextElement) {
      nextElement.focus();
    } else {
      predictPrice();
    }
  }
}

const updatePriceTrendChart = (currentPrice) => {
  const ctx = document.getElementById('price-chart').getContext('2d');
  
  // Generate mock data for price trend
  const labels = ['1年前', '現在', '1年後', '2年後', '3年後'];
  const data = [
    currentPrice * 0.95,
    currentPrice,
    currentPrice * 1.03,
    currentPrice * 1.06,
    currentPrice * 1.09
  ];

  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '預測房價趨勢',
        data: data,
        borderColor: '#64ffda',
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(100, 255, 218, 0.1)'
          },
          ticks: {
            color: '#8892b0'
          }
        },
        x: {
          grid: {
            color: 'rgba(100, 255, 218, 0.1)'
          },
          ticks: {
            color: '#8892b0'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#8892b0'
          }
        }
      }
    }
  });
}

