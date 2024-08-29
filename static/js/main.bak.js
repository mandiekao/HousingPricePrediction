let priceChart;

function focusNext(event, nextFieldId) {
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

function predictPrice() {
  if (!validateForm()) {
    alert('請填寫所有必填欄位');
    return;
  }

  const loading = document.getElementById('loading');
  const result = document.getElementById('result');
  
  loading.style.display = 'block';
  result.textContent = '';

  // Collect input data
  const inputData = {
    house_age: document.getElementById('house_age').value,
    area_ping: document.getElementById('area_ping').value,
    elevator: document.getElementById('elevator').value,
    manager: document.getElementById('manager').value,
    parking_spaces: document.getElementById('parking_spaces').value,
    floor: document.getElementById('floor').value,
    total_floors: document.getElementById('total_floors').value,
    rooms: document.getElementById('rooms').value,
    living_rooms: document.getElementById('living_rooms').value,
    bathrooms: document.getElementById('bathrooms').value,
    building_type: document.getElementById('building_type').value,
    usage: document.getElementById('usage').value,
    predicted_year: document.getElementById('predicted_year').value
  };

  // Simulate API call with setTimeout
  setTimeout(() => {
    // Mock prediction calculation
    const basePrice = 500000; // Base price per ping
    const areaPing = parseFloat(inputData.area_ping) || 0;
    const houseAge = parseInt(inputData.house_age) || 0;
    const ageFactor = Math.max(0.7, 1 - (houseAge * 0.01)); // Decrease 1% per year, minimum 70%
    
    let predictedPrice = basePrice * areaPing * ageFactor;
    
    // Apply some basic adjustments based on other factors
    if (inputData.elevator === "有") predictedPrice *= 1.1;
    if (inputData.manager === "有") predictedPrice *= 1.05;
    if (inputData.parking_spaces === "有") predictedPrice *= 1.08;
    if (inputData.building_type === "住宅大楼") predictedPrice *= 1.2;
    if (inputData.usage === "住商用") predictedPrice *= 1.15;

    // Adjust based on floor level
    const floorLevel = parseInt(inputData.floor);
    if (floorLevel === 2) predictedPrice *= 1.05;
    else if (floorLevel === 3) predictedPrice *= 1.1;
    else if (floorLevel === 4) predictedPrice *= 1.15;

    // Format the result
    const formattedPrice = new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(predictedPrice);
    
    loading.style.display = 'none';
    result.innerHTML = `預測房價: <span style="color: #64ffda; font-size: 1.2em;">${formattedPrice}</span>`;

    // Update unit price
    const unitPrice = (predictedPrice / areaPing / 10000).toFixed(2);
    document.getElementById('unit_price').textContent = `${unitPrice} 萬/坪`;

    // Update price trend chart
    updatePriceTrendChart(predictedPrice);
  }, 2000); // Simulate 2 second delay for API call
}

function calculateMortgage() {
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

function updatePriceTrendChart(currentPrice) {
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

function validateForm() {
  const rooms = document.getElementById('rooms').value;
  const predictedYear = document.getElementById('predicted_year').value;
  return rooms !== '' && predictedYear !== '';
}

// Initialize the chart with dummy data
updatePriceTrendChart(10000000);
