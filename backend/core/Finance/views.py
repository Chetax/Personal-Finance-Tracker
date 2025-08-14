from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from datetime import date

from .models import Category, Expense, Income, Budget, Notification
from .serializers import CategorySerializer, ExpenseSerializer, IncomeSerializer, BudgetSerializer, NotificationSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        budgets = Budget.objects.filter(
            user=self.request.user,
            category=expense.category,
            month__year=expense.date.year,
            month__month=expense.date.month
        )
        print(budgets)
        for budget in budgets:
            if budget.is_overspent():
                Notification.objects.create(
                    user=self.request.user,
                    message=f"You have exceeded your budget for {budget.category.name} this month."
                )

class IncomeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IncomeSerializer

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        month_start = today.replace(day=1)

        total_expenses = Expense.objects.filter(user=request.user, date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        total_incomes = Income.objects.filter(user=request.user, date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0

        expenses_by_category = Expense.objects.filter(user=request.user, date__gte=month_start) \
            .values('category__name') \
            .annotate(total=Sum('amount')) \
            .order_by('-total')

        return Response({
            'month': month_start,
            'total_expenses': float(total_expenses),
            'total_incomes': float(total_incomes),
            'expenses_by_category': list(expenses_by_category),
        })

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
