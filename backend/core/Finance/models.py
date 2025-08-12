from django.db import models
from django.conf import settings
from django.utils import timezone

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

    def __str__(self):
        return f"{self.user} - {self.category} - {self.month.strftime('%Y-%m')}"
