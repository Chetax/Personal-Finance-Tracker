from rest_framework import serializers
from .models import Category, Expense, Income, Budget

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'user', 'category', 'amount', 'description', 'date']
        read_only_fields = ['user']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'user', 'category', 'amount', 'description', 'date']
        read_only_fields = ['user']

class BudgetSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'amount', 'month']
        read_only_fields = ['user']
