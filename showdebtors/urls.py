from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^calc_debts/$', views.calc_debts, name='calc_debts'),
]