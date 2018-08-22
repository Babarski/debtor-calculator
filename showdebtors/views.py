# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import JsonResponse
from django.shortcuts import render
from debts import calc_debtors, prepare_for_calculation
# Create your views here.

def calc_debts(request):

    data_for_calculation = prepare_for_calculation(dict(request.POST))
    debts = calc_debtors(data_for_calculation)
    return JsonResponse(debts)

def home(request):

    if request.method == 'POST':
        print(request.POST)

    return render(request, 'home.html', locals())