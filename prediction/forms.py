# forms.py
from django import forms

class PredictionForm(forms.Form):
    house_age = forms.FloatField(label='屋齡')
    area_ping = forms.FloatField(label='面積 (坪)', required=False)
    elevator = forms.ChoiceField(choices=[('有', '有'), ('無', '無')], label='電梯', required=False)
    manager = forms.ChoiceField(choices=[('有', '有'), ('無', '無')], label='管理員', required=False)
    parking_spaces = forms.FloatField(label='車位數量', required=False)
    floor_level = forms.FloatField(label='樓別', required=False)
    total_floors = forms.FloatField(label='樓高', required=False)
    rooms = forms.FloatField(label='房')
    living_rooms = forms.FloatField(label='廳', required=False)
    bathrooms = forms.FloatField(label='衛', required=False)
    building_type = forms.ChoiceField(choices=[('住宅大楼', '住宅大楼'), ('公寓', '公寓'), ('套房', '套房'), ('華夏', '華夏'), ('透天厝', '透天厝')], label='建物類型', required=False)
    usage = forms.ChoiceField(choices=[('住家用', '住家用'), ('住商用', '住商用'), ('商業用', '商業用'), ('辦公用', '辦公用')], label='用途', required=False)
    predicted_year = forms.FloatField(label='預計年度(民國)')

    # 继续添加其他所需特征字段


