# prediction/views.py
from django.shortcuts import render
from .forms import PredictionForm  # 导入 PredictionForm
import numpy as np
from django.http import JsonResponse


import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.impute import SimpleImputer
import joblib
from django.conf import settings

def calc(request):
    rfModel_price = joblib.load('ml_model/rfModel')
    rmse_in_ten_thousands = joblib.load('ml_model/rmse_in_ten_thousands')

    longitude = request.GET.get('lon')
    latitude = request.GET.get('lat')
    age = request.GET.get('age')
    pin = request.GET.get('pin')
    lift = request.GET.get('lif')
    security = request.GET.get('sec')
    parkinglot = request.GET.get('pl')
    year = request.GET.get('yr')
    floor_level = request.GET.get('fl')
    total_floor = request.GET.get('tf')
    room = request.GET.get('rm')
    livingroom = request.GET.get('lr')
    bathroom = request.GET.get('br')
    building_type = request.GET.get('bt')
    apartment = request.GET.get('am')
    suite = request.GET.get('st')
    Huaxia = request.GET.get('hx')
    House = request.GET.get('hs')
    commercial_use = request.GET.get('cu')
    residential_use = request.GET.get('ru')
    business_use = request.GET.get('bu')
    office_use = request.GET.get('ou')
    district = request.GET.get('ds')
    

    test = np.array([longitude, # 120.6624, #經度
                    latitude, # 24.1208,  #緯度
                    age, #20, #屋齡
                    pin, #26, #坪數
                    lift,  #電梯
                    security,  #管理員
                    parkinglot,  #車位
                    year,  # 交易年
                    floor_level,  # 樓別
                    total_floor,  # 樓高
                    room,  # 房
                    livingroom,  # 廳
                    bathroom,  # 衛
                    building_type,  # 住宅大樓
                    apartment,  # 公寓
                    suite,  # 套房
                    Huaxia,  # 華夏
                    House,  # 透天厝
                    commercial_use,  # 住商用
                    residential_use,  # 住家用
                    business_use,  # 商業用
                    office_use,  # 辦公用
                    district  # 行政區
                    ]).reshape(1, 23)

    price_pred = rfModel_price.predict(test)
    max_ =  (price_pred[0] / 10000) + rmse_in_ten_thousands
    min_ =  (price_pred[0] / 10000) - rmse_in_ten_thousands
    return JsonResponse({"predict_price": price_pred[0]/ 10000, "max": max_, "min": min_})




####  
def house(request): 
    return render(request, 'prediction/home.html')

def predict_price(request):
    predicted_price = None
    if request.method == "POST":
        form = PredictionForm(request.POST)
        if form.is_valid():
            # 获取表单中的数据
            data = form.cleaned_data
            # 创建输入数组用于模型预测
            test = np.array([
                data['longitude'], 
                data['latitude'], 
                data['age'], 
                data['area'], 
                data['elevator'], 
                data['manager'], 
                data['parking'], 
                data['floor_level'], 
                data['building_type'], 
                data['use_type'], 
                data['district']
            ]).reshape(1, -1)
            
            # 使用模型预测房价
            price_pred = rfModel_price.predict(test)
            predicted_price = price_pred[0] / 10000  # 转换为万元

    else:
        form = PredictionForm()

    return render(request, 'prediction/custom_template.html', {
        'form': form,
        'predicted_price': predicted_price,
    })

