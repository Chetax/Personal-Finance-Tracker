from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum

from django.utils.timezone import now

class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name

class TransactionBase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)ss')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="%(class)ss")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateField(default=timezone.now().date())

    class Meta:
        abstract = True

class Expense(TransactionBase):
    pass

class Income(TransactionBase):
    pass

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField()  

    def spent_amount(self):
        
        return self.user.expenses.filter(
            category=self.category,
            date__month=self.month.month,
            date__year=self.month.year
            
        ).aggregate(total=Sum('amount'))['total'] or 0

    def is_overspent(self):
        
        return self.spent_amount() > self.amount
    
    def __str__(self):
        return f"{self.user} - {self.category} - {self.month.strftime('%Y-%m')}"
    
    

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email}: {self.message}"
