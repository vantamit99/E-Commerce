var submit = document.getElementById('submitData');
var chooseMonth = document.querySelectorAll('#chooseMonth option');
var chooseYear = document.getElementById('chooseYear');

var chartCanvas = document.getElementById('myChart');
var ctx = chartCanvas.getContext('2d');
let dataPaypal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let dataDelivery = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Ngày 1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [{
            label: 'Thống kê doanh thu paypal',
            backgroundColor: 'transparent',
            borderColor: 'rgb(255, 99, 132)',
            data: dataPaypal,
        },
        {
            label: 'Thống kê doanh thu tiền mặt',
            backgroundColor: 'transparent',
            borderColor: '#f17d2b',
            data: dataDelivery,
        }
        ]
    },    
    options: {}
});

submit.addEventListener('click', ()=> {    
    let getMonth;
    let getYear;
    chooseMonth.forEach(item => {
        if(item.selected){
            getMonth = item.value;
        }
    });
    getYear = chooseYear.value;
    let xhttp = new XMLHttpRequest();
    xhttp.open('get', `/dashboard/revenue/filterDate?month=${getMonth}&year=${getYear}`, true);
    xhttp.onreadystatechange = function() {
        if(this.status === 200 && this.readyState === 4) {
            let dataServer = JSON.parse(this.responseText);
            let arrDayDelivery = [];
            let arrDayPaypal = [];
            console.log(dataServer);
            if(dataServer.length == 0) {
                dataPaypal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                dataDelivery = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            }
            dataServer.map(item => {
                if(item.method == "thanh toán khi nhận hàng") {
                    dataDelivery[item.day-1] = item.totalMoney; 
                    arrDayDelivery.push(item.day-1);                
                } else {
                    dataPaypal[item.day-1] = item.totalMoney;
                    arrDayPaypal.push(item.day-1);       
                }
                return item;
            })
            if(arrDayDelivery.length == 0) {
                dataDelivery = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            }
            if(arrDayPaypal.length == 0) {
                dataPaypal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            }
            dataDelivery.map((val, index) => {
                if(arrDayDelivery.indexOf(index) == -1) {
                    dataDelivery[index] = 0;
                }
                return val;
            })
            dataPaypal.map((val, index) => {
                if(arrDayPaypal.indexOf(index) == -1) {
                    dataPaypal[index] = 0;
                }
                return val;
            })

            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ngày 1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                    datasets: [{
                        label: 'Thống kê doanh thu paypal',
                        backgroundColor: 'transparent',
                        borderColor: 'rgb(255, 99, 132)',
                        data: dataPaypal,
                    },
                    {
                        label: 'Thống kê doanh thu tiền mặt',
                        backgroundColor: 'transparent',
                        borderColor: '#f17d2b',
                        data: dataDelivery,
                    }
                    ]
                },    
                options: {}
            });
        }
    };
    xhttp.send();   
});
