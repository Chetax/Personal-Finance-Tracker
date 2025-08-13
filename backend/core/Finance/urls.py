from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, ExpenseViewSet, IncomeViewSet, BudgetViewSet, AnalyticsView

router = DefaultRouter()
router.register(r'categories/', CategoryViewSet, basename='category')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'incomes', IncomeViewSet, basename='income')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = router.urls + [
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
