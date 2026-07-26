import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck, Building2, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/saasData';
import { UserAccount, UserPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSelectPlan: (planId: UserPlan) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <h2 className="font-extrabold text-base text-white">Nexus AI Subscription Plans</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the tier that fits your workflow. Upgrade or downgrade anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-lg px-4 py-1.5 font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center space-x-1.5 rounded-lg px-4 py-1.5 font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] text-teal-300 font-extrabold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = currentUser.plan === plan.id;
              const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                    plan.popular
                      ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 shadow-xl shadow-indigo-900/20'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 px-3 py-0.5 text-[10px] font-extrabold text-white shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-extrabold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 min-h-[36px] mb-4">{plan.description}</p>

                    <div className="flex items-baseline space-x-1 mb-6">
                      <span className="text-3xl font-black text-white">${price}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                      {billingCycle === 'annual' && price > 0 && (
                        <span className="text-[10px] text-teal-400 ml-1 font-semibold">
                          (billed annually)
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Included Features:
                      </div>
                      {plan.features.map((ft, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                          <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{ft}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPlan(plan.id);
                      onClose();
                    }}
                    disabled={isCurrent}
                    className={`w-full rounded-xl py-3 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'border border-slate-800 bg-slate-800 text-slate-400 cursor-default'
                        : plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95'
                        : 'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                    }`}
                  >
                    {isCurrent ? 'Current Active Plan' : plan.ctaText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Enterprise Contact Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <div>
                <span className="font-bold text-slate-200">Need custom volume or dedicated VPC isolation?</span>
                <p className="text-slate-400 text-[11px]">Contact our AI solutions team for customized SLAs.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
