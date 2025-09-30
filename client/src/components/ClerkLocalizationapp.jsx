// components/ClerkLocalizationapp.jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { arSA, enUS } from '@clerk/localizations';
import useLanguage from '../hooks/useLanguage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function ClerkLocalizedApp({ children }) {
  const { currentLanguage } = useLanguage();

  const getClerkLocalization = () => {
    const baseLocalization = currentLanguage === 'ar' ? arSA : enUS;

    // Add custom translations for billing/pricing components
    return {
      ...baseLocalization,

      // Badges and status labels
      badge__activePlan: currentLanguage === 'ar' ? 'مفعل' : 'Active',
      badge__currentPlan:
        currentLanguage === 'ar' ? 'الخطة الحالية' : 'Current Plan',
      badge__canceledEndsAt:
        currentLanguage === 'ar'
          ? 'ملغى - ينتهي في {{date}}'
          : 'Canceled - ends at {{date}}',
      badge__endsAt:
        currentLanguage === 'ar' ? 'ينتهي في {{date}}' : 'Ends at {{date}}',
      badge__expired: currentLanguage === 'ar' ? 'منتهي' : 'Expired',
      badge__freeTrial:
        currentLanguage === 'ar' ? 'فترة تجريبية مجانية' : 'Free Trial',
      badge__pastDueAt:
        currentLanguage === 'ar'
          ? 'متأخر - الدفع مطلوب'
          : 'Past Due - Payment Required',
      badge__pastDuePlan:
        currentLanguage === 'ar' ? 'خطة متأخرة' : 'Past Due Plan',
      badge__renewsAt:
        currentLanguage === 'ar' ? 'يتجدد في {{date}}' : 'Renews at {{date}}',
      badge__startsAt:
        currentLanguage === 'ar' ? 'يبدأ في {{date}}' : 'Starts at {{date}}',
      badge__trialEndsAt:
        currentLanguage === 'ar'
          ? 'الفترة التجريبية تنتهي في {{date}}'
          : 'Trial ends at {{date}}',
      badge__upcomingPlan:
        currentLanguage === 'ar' ? 'الخطة القادمة' : 'Upcoming Plan',

      // Commerce/Billing section
      commerce: {
        ...baseLocalization.commerce,

        // Basic billing terms
        subscribe: currentLanguage === 'ar' ? 'اشترك' : 'Subscribe',
        pay: currentLanguage === 'ar' ? 'ادفع' : 'Pay',
        alwaysFree: currentLanguage === 'ar' ? 'مجاني دائماً' : 'Always free',
        perMonth: currentLanguage === 'ar' ? '/شهر' : '/month',
        popular: currentLanguage === 'ar' ? 'شائع' : 'Popular',
        free: currentLanguage === 'ar' ? 'مجاني' : 'Free',
        monthly: currentLanguage === 'ar' ? 'شهرياً' : 'Monthly',
        annually: currentLanguage === 'ar' ? 'سنوياً' : 'Annually',
        year: currentLanguage === 'ar' ? 'سنة' : 'Year',
        month: currentLanguage === 'ar' ? 'شهر' : 'Month',

        // Billing actions
        manageSubscription:
          currentLanguage === 'ar' ? 'إدارة الاشتراك' : 'Manage subscription',
        cancelSubscription:
          currentLanguage === 'ar' ? 'إلغاء الاشتراك' : 'Cancel subscription',
        switchPlan: currentLanguage === 'ar' ? 'تغيير الخطة' : 'Switch plan',
        addPaymentMethod:
          currentLanguage === 'ar' ? 'إضافة طريقة دفع' : 'Add payment method',
        reSubscribe:
          currentLanguage === 'ar' ? 'إعادة الاشتراك' : 'Re-subscribe',
        startFreeTrial:
          currentLanguage === 'ar'
            ? 'بدء الفترة التجريبية'
            : 'Start free trial',
        seeAllFeatures:
          currentLanguage === 'ar' ? 'عرض جميع الميزات' : 'See all features',
        viewFeatures:
          currentLanguage === 'ar' ? 'عرض الميزات' : 'View features',
        getStarted: currentLanguage === 'ar' ? 'ابدأ الآن' : 'Get started',
        manage: currentLanguage === 'ar' ? 'إدارة' : 'Manage',

        // Billing status
        pastDue: currentLanguage === 'ar' ? 'متأخر' : 'Past Due',
        credit: currentLanguage === 'ar' ? 'رصيد' : 'Credit',
        creditRemainder:
          currentLanguage === 'ar' ? 'الرصيد المتبقي' : 'Credit Remainder',
        defaultFreePlanActive:
          currentLanguage === 'ar'
            ? 'الخطة المجانية مفعلة'
            : 'Default free plan active',

        // Billing cycles
        billedAnnually:
          currentLanguage === 'ar' ? 'الفوترة سنوياً' : 'Billed annually',
        billedMonthlyOnly:
          currentLanguage === 'ar'
            ? 'الفوترة شهرية فقط'
            : 'Billed monthly only',
        switchToAnnual:
          currentLanguage === 'ar' ? 'التحويل إلى سنوي' : 'Switch to annual',
        switchToMonthly:
          currentLanguage === 'ar' ? 'التحويل إلى شهري' : 'Switch to monthly',

        // Payment methods
        paymentMethods:
          currentLanguage === 'ar' ? 'طرق الدفع' : 'Payment methods',

        // Pricing table
        pricingTable: {
          ...baseLocalization.commerce?.pricingTable,
          billingCycle:
            currentLanguage === 'ar' ? 'دورة الفوترة' : 'Billing cycle',
          included: currentLanguage === 'ar' ? 'مشمول' : 'Included',
        },

        // Checkout
        checkout: {
          ...baseLocalization.commerce?.checkout,
          title: currentLanguage === 'ar' ? 'إتمام الدفع' : 'Checkout',
          perMonth: currentLanguage === 'ar' ? '/شهر' : '/month',
          title__paymentSuccessful:
            currentLanguage === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful',
          title__subscriptionSuccessful:
            currentLanguage === 'ar'
              ? 'تم الاشتراك بنجاح'
              : 'Subscription Successful',
          downgradeNotice:
            currentLanguage === 'ar'
              ? 'سيتم تطبيق التغيير في دورة الفوترة القادمة'
              : 'Changes will apply to your next billing cycle',
        },

        // Subscription details
        subscriptionDetails: {
          ...baseLocalization.commerce?.subscriptionDetails,
          title:
            currentLanguage === 'ar'
              ? 'تفاصيل الاشتراك'
              : 'Subscription Details',
          beginsOn: currentLanguage === 'ar' ? 'يبدأ في' : 'Begins on',
          endsOn: currentLanguage === 'ar' ? 'ينتهي في' : 'Ends on',
          renewsAt: currentLanguage === 'ar' ? 'يتجدد في' : 'Renews at',
          currentBillingCycle:
            currentLanguage === 'ar'
              ? 'دورة الفوترة الحالية'
              : 'Current Billing Cycle',
        },

        // Amounts and totals
        subtotal: currentLanguage === 'ar' ? 'المجموع الفرعي' : 'Subtotal',
        totalDue: currentLanguage === 'ar' ? 'المبلغ المستحق' : 'Total Due',
        totalDueToday: currentLanguage === 'ar' ? 'المستحق اليوم' : 'Due Today',

        // Payment source
        paymentSource: {
          ...baseLocalization.commerce?.paymentSource,
          dev: {
            ...baseLocalization.commerce?.paymentSource?.dev,
            cardNumber:
              currentLanguage === 'ar' ? 'رقم البطاقة' : 'Card number',
            expirationDate:
              currentLanguage === 'ar' ? 'تاريخ الانتهاء' : 'Expiration date',
            testCardInfo:
              currentLanguage === 'ar'
                ? 'بطاقة اختبار - استخدم أي أرقام'
                : 'Test card - use any numbers',
          },
        },
      },

      // User Profile Billing Page
      userProfile: {
        ...baseLocalization.userProfile,
        billingPage: {
          ...baseLocalization.userProfile?.billingPage,
          title:
            currentLanguage === 'ar'
              ? 'الفواتير والاشتراكات'
              : 'Billing & Subscriptions',

          // Payment History Section
          paymentHistorySection: {
            ...baseLocalization.userProfile?.billingPage?.paymentHistorySection,
            empty:
              currentLanguage === 'ar'
                ? 'لا توجد مدفوعات سابقة'
                : 'No payment history',
            tableHeader__amount: currentLanguage === 'ar' ? 'المبلغ' : 'Amount',
            tableHeader__date: currentLanguage === 'ar' ? 'التاريخ' : 'Date',
            tableHeader__status: currentLanguage === 'ar' ? 'الحالة' : 'Status',
          },

          // Payment Sources Section
          paymentSourcesSection: {
            ...baseLocalization.userProfile?.billingPage?.paymentSourcesSection,
            title: currentLanguage === 'ar' ? 'طرق الدفع' : 'Payment Methods',
            add:
              currentLanguage === 'ar'
                ? 'إضافة طريقة دفع'
                : 'Add payment method',
            payWithTestCardButton:
              currentLanguage === 'ar'
                ? 'الدفع ببطاقة اختبار'
                : 'Pay with test card',
            actionLabel__remove: currentLanguage === 'ar' ? 'إزالة' : 'Remove',
            actionLabel__default:
              currentLanguage === 'ar' ? 'تعيين كافتراضي' : 'Set as default',
            removeResource: {
              ...baseLocalization.userProfile?.billingPage
                ?.paymentSourcesSection?.removeResource,
              title:
                currentLanguage === 'ar'
                  ? 'إزالة طريقة الدفع'
                  : 'Remove Payment Method',
              messageLine1:
                currentLanguage === 'ar'
                  ? 'سيتم إزالة طريقة الدفع هذه'
                  : 'This payment method will be removed',
            },
          },

          // Subscriptions Section
          subscriptionsSection: {
            ...baseLocalization.userProfile?.billingPage?.subscriptionsSection,
            actionLabel__default:
              currentLanguage === 'ar' ? 'الافتراضي' : 'Default',
          },

          // Subscriptions List Section
          subscriptionsListSection: {
            ...baseLocalization.userProfile?.billingPage
              ?.subscriptionsListSection,
            title:
              currentLanguage === 'ar'
                ? 'الاشتراكات النشطة'
                : 'Active Subscriptions',
            actionLabel__manageSubscription:
              currentLanguage === 'ar'
                ? 'إدارة الاشتراك'
                : 'Manage Subscription',
            actionLabel__switchPlan:
              currentLanguage === 'ar' ? 'تغيير الخطة' : 'Switch Plan',
            tableHeader__plan: currentLanguage === 'ar' ? 'الخطة' : 'Plan',
            tableHeader__startDate:
              currentLanguage === 'ar' ? 'تاريخ البدء' : 'Start Date',
          },

          // Statements Section
          statementsSection: {
            ...baseLocalization.userProfile?.billingPage?.statementsSection,
            title: currentLanguage === 'ar' ? 'الفواتير' : 'Statements',
            tableHeader__amount: currentLanguage === 'ar' ? 'المبلغ' : 'Amount',
            tableHeader__date: currentLanguage === 'ar' ? 'التاريخ' : 'Date',
            totalPaid:
              currentLanguage === 'ar' ? 'إجمالي المدفوع' : 'Total Paid',
          },

          // Switch Plans Section
          switchPlansSection: {
            ...baseLocalization.userProfile?.billingPage?.switchPlansSection,
            title: currentLanguage === 'ar' ? 'تغيير الخطة' : 'Switch Plans',
          },

          // Start section headers
          start: {
            ...baseLocalization.userProfile?.billingPage?.start,
            headerTitle__payments:
              currentLanguage === 'ar' ? 'المدفوعات' : 'Payments',
            headerTitle__plans: currentLanguage === 'ar' ? 'الخطط' : 'Plans',
            headerTitle__subscriptions:
              currentLanguage === 'ar' ? 'الاشتراكات' : 'Subscriptions',
            headerTitle__statements:
              currentLanguage === 'ar' ? 'الفواتير' : 'Statements',
          },
        },

        // Navbar billing link
        navbar: {
          ...baseLocalization.userProfile?.navbar,
          billing: currentLanguage === 'ar' ? 'الفواتير' : 'Billing',
        },
      },
    };
  };

  return (
    <ClerkProvider
      key={currentLanguage}
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
      }}
      localization={getClerkLocalization()}
      touchSession={false}
    >
      {children}
    </ClerkProvider>
  );
}
